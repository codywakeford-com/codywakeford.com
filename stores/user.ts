import { defineStore } from "pinia"
import { signOut as firebaseSignOut } from "firebase/auth"
export const useUserStore = defineStore("userStore", {
    state: () => ({
        user: {} as User,
        isLoading: true,
    }),

    getters: {
        get(state) {
            return state.user
        },

        stripeCustomerId(state) {
            return state.user?.stripePaymentProfile?.customerId
        },

        id(state) {
            if (!state.user.id) throw new Error("User not found")

            return state.user.id
        },

        stripePaymentProfile(state) {
            return state.user.stripePaymentProfile
        },

        email(state) {
            const email = state.user.email
            if (!email) throw new Error("User not found")
            return email
        },

        role(state) {
            if (!import.meta.client) return "client"
            const domain = window.location.hostname

            if (state.user && state.user.siteAccess) {
                const siteRole = state.user.siteAccess.find((site) => site.domain === domain)

                if (!siteRole) return "client"
                return siteRole.role
            }
        },

        isAdmin(state): boolean {
            const domain = window.location.hostname

            if (!state.user || !state.user.siteAccess) return false

            const siteRole = state.user.siteAccess.find((site) => site.domain === domain)

            if (!siteRole?.role) return false
            if (siteRole.role === "user") return false

            return true
        },
    },

    actions: {
        /**Await the user object being fufilled if loading. */
        async isAuthenticated(): Promise<boolean> {
            while (this.isLoading) {
                await new Promise((resolve) => setTimeout(resolve, 100))
            }

            return !!(this.user.id && this.user.email)
        },

        async init() {
            this.isLoading = true
            const cachedUser = await this.readCache()

            if (!cachedUser) {
                this.isLoading = false
                return navigateTo("/")
            }

            this.user = cachedUser
            this.isLoading = false
        },

        async signUp(provider: AuthProvider, email: string, password: string) {
            try {
                const user = await signUp(provider, email, password)
            } catch (error) {
                return error
            }
        },

        async signIn(provider: AuthProvider, email: string, password: string) {
            try {
                const user = await signIn(provider, email, password)
                if (user) {
                    this.user = user
                    this.writeCache(user)
                }

                return navigateTo("/dashboard/client")
            } catch (error) {
                return error
            }
        },

        async readAccess(id: User["id"]): Promise<User["siteAccess"]> {
            const data = await $fetch<User["siteAccess"]>(`/api/users/access`, {
                params: { id: id },
            })

            return data || []
        },

        async logout() {
            const $auth = useAuth()
            try {
                await firebaseSignOut($auth)
                this.clearUser()
                navigateTo("/")
                console.debug("[Veloris] User logged out, cache cleared.")
            } catch (error) {
                console.error("Logout failed: ", error)
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

                if (!this.user.stripePaymentProfile) {
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

                this.user.stripePaymentProfile.paymentMethods.push(paymentMethod)
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
            const paymentProfileIndex = this.user.stripePaymentProfile.paymentMethods.findIndex((profile) => {
                return profile.paymentMethodId === paymentMethodId
            })

            if (paymentProfileIndex === -1) throw new Error("No profile found")

            const paymentProfile = this.user.stripePaymentProfile.paymentMethods[paymentProfileIndex]

            this.user.stripePaymentProfile?.paymentMethods?.splice(paymentProfileIndex, 1)

            try {
                await $fetch(`/api/users/${$User.id}/methods/${paymentMethodId}`, {
                    method: "DELETE",
                })

                this.writeCache(this.user)
            } catch (error) {
                this.user.stripePaymentProfile.paymentMethods.push(paymentProfile)
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

        clearUser() {
            this.user = {} as User
            this.removeCache()
        },

        async removeCache() {
            if (import.meta.client) localStorage.removeItem("user")
        },
    },
})
