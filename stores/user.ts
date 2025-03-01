import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"

export const useUserStore = defineStore("userStore", {
    state: () => ({
        user: null as User | null,
        jwt: null as null | string,
        isLoading: true,
        reciepts: [] as PaymentRecord[],
    }),

    getters: {
        getReciepts(state) {
            return state.reciepts
        },

        stripeCustomerId(state) {
            return state.user?.stripePaymentProfile?.customerId
        },

        stripePaymentProfile(state) {
            return state.user?.stripePaymentProfile
        },
    },

    actions: {
        async init() {
            this.jwt = localStorage.getItem("jwt")

            if (!this.jwt) return

            const jwtValid = await this.validateJwt(this.jwt)

            if (jwtValid) {
                const payload = jwtDecode(this.jwt)
                this.user = payload as User
            }

            this.isLoading = false

            try {
                const reciepts = await readArray<PaymentRecord>(`/users/${this.user?.id}/payment-records`)

                this.reciepts = [...reciepts]
            } catch (error) {
                console.error("failed to fetch reciepts", error)
            }
        },

        async validateJwt(jwt: string): Promise<boolean> {
            try {
                const { valid, payload } = await $fetch<Api.Auth.ValidateJwt.Response>("/api/auth/validate-jwt", {
                    method: "POST",
                    body: { token: jwt } as Api.Auth.ValidateJwt.Request,
                })

                this.user = payload
                if (valid) return true
                else {
                    this.logout()
                    return false
                }
            } catch (e) {
                this.logout()
                return false
            }
        },

        async register(email: string, password: string) {
            try {
                const reponse = await $fetch<Api.Auth.Register.Response>("/api/auth/register", {
                    method: "POST",
                    body: { email, password } as Api.Auth.Register.Request,
                })
            } catch (error) {
                return error
            }
        },

        async login(email: string, password: string) {
            try {
                const jwt = await $fetch<Api.Auth.Login.Response>("/api/auth/login", {
                    method: "POST",
                    body: { email, password } as Api.Auth.Login.Request,
                })

                const payload = jwtDecode(jwt) as User

                console.log(payload)

                if (payload) {
                    this.user = payload
                    localStorage.setItem("jwt", jwt)
                    this.writeCache(payload)
                }
            } catch (error) {
                return error
            }
        },

        async createStripeCustomer() {
            try {
                const customer = await $Stripe.createCustomer($User.email)

                if (!customer) throw new Error("Customer failed to create")

                const stripePaymentProfile: User["stripePaymentProfile"] = {
                    customerId: customer.id,
                    paymentMethods: [],
                }

                await $fetch(`/api/users/${$User.id}`, {
                    method: "PUT",
                    body: { stripePaymentProfile },
                })

                if (!this.user) throw new Error("User not found!")

                if (!this.user?.stripePaymentProfile) {
                    this.user.stripePaymentProfile = { customerId: "", paymentMethods: [] }
                }

                this.user.stripePaymentProfile.customerId = customer.id
            } catch (error) {
                console.error(error)
            }
        },

        async addPaymentMethod(paymentMethod: PaymentMethod) {
            try {
                await $fetch(`/api/users/${$User.id}/payment-methods`, {
                    method: "POST",
                    body: { paymentMethod },
                })

                this.user?.stripePaymentProfile.paymentMethods.push(paymentMethod)
            } catch (error) {
                console.error(error)
            }
        },

        async addPaymentRecord(projectId: Project["id"], paymentRecord: PaymentRecord) {
            if (!projectId) throw new Error("no prohject id")

            try {
                await $fetch(`/api/users/${$User.id}/payment-record`, {
                    method: "POST",
                    body: {
                        paymentRecord,
                        projectId,
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },

        async deletePaymentProfile(paymentMethodId: PaymentMethod["paymentMethodId"]) {
            const paymentProfileIndex = this.user?.stripePaymentProfile.paymentMethods.findIndex((profile) => {
                return profile.paymentMethodId === paymentMethodId
            })

            if (paymentProfileIndex === -1) throw new Error("No profile found")

            const paymentProfile = this.user?.stripePaymentProfile.paymentMethods[paymentProfileIndex]

            this.user?.stripePaymentProfile?.paymentMethods?.splice(paymentProfileIndex, 1)

            try {
                await $fetch(`/api/users/${$User.id}/methods/${paymentMethodId}`, {
                    method: "DELETE",
                })

                this.writeCache(this.user!)
            } catch (error) {
                this.user?.stripePaymentProfile.paymentMethods.push(paymentProfile)
                console.error(error)
            }
        },

        writeCache(user: User) {
            if (!import.meta.client) return
            localStorage.setItem("user", JSON.stringify(user))
        },

        async readCache() {
            if (!import.meta.client) return

            const cachedUser = localStorage.getItem("user")

            if (cachedUser) {
                try {
                    console.log("User fetched from client localStorage")
                    return JSON.parse(cachedUser)
                } catch (error) {
                    console.error("Failed to parse cached user data:", error)
                    return {} as User
                }
            }
        },

        logout() {
            this.user = null
            localStorage.removeItem("jwt")

            return navigateTo("/")
        },
    },
})
