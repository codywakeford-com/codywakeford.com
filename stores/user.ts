import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"

interface State {
    user: User | null
    jwt: string | null
    isLoading: boolean
    reciepts: PaymentRecord[]
}

export const useUserStore = defineStore("userStore", () => {
    const state = ref<State>({
        user: null,
        jwt: null,
        isLoading: true,
        reciepts: [],
    })

    const email = computed<string>(() => {
        return state.value.user?.email || "No email"
    })

    const isStaff = computed<boolean>(() => {
        if (!state.value.user) return false
        return state.value.user.role === "staff"
    })

    const getStripeCustomerId = computed<string | undefined>(() => {
        return state.value.user?.stripePaymentProfile?.customerId || undefined
    })

    const getReciepts = computed(() => {
        return state.value.reciepts
    })

    const stripeCustomerId = computed<string | undefined>(() => {
        return state.value.user?.stripePaymentProfile?.customerId
    })

    const stripePaymentProfile = computed(() => {
        return state.value.user?.stripePaymentProfile
    })

    const paymentMethods = computed(() => {
        return state.value.user?.stripePaymentProfile.paymentMethods || []
    })

    async function init() {
        state.value.jwt = localStorage.getItem("jwt")

        if (!state.value.jwt) return

        const jwtValid = await validateJwt(state.value.jwt)

        if (jwtValid) {
            const payload = jwtDecode(state.value.jwt)
            state.value.user = payload as User
        }

        state.value.isLoading = false

        try {
            const reciepts = await readArray<PaymentRecord>(`/users/${state.value.user?.id}/payment-records`)

            state.value.reciepts = [...reciepts]
        } catch (error) {
            console.error("failed to fetch reciepts", error)
        }
    }

    async function validateJwt(jwt: string): Promise<boolean> {
        try {
            const { valid, payload } = await $fetch<Api.Auth.ValidateJwt.Response>("/api/auth/validate-jwt", {
                method: "POST",
                body: { token: jwt } as Api.Auth.ValidateJwt.Request,
            })

            state.value.user = payload
            if (valid) return true
            else {
                logout()
                return false
            }
        } catch (e) {
            logout()
            return false
        }
    }

    async function register(email: string, password: string) {
        try {
            const reponse = await $fetch<Api.Auth.Register.Response>("/api/auth/register", {
                method: "POST",
                body: { email, password } as Api.Auth.Register.Request,
            })
        } catch (error) {
            return error
        }
    }

    async function login(email: string, password: string) {
        try {
            const jwt = await $fetch<Api.Auth.Login.Response>("/api/auth/login", {
                method: "POST",
                body: { email, password } as Api.Auth.Login.Request,
            })

            const payload = jwtDecode(jwt) as User

            if (payload) {
                state.value.user = payload
                state.value.jwt = jwt
                localStorage.setItem("jwt", jwt)
            }

            return navigateTo("/")
        } catch (error) {
            if (error.status === 401) {
                throw new Error("Email or password incorrect.")
            } else {
                throw new Error("An unknown error has occured.")
            }
        }
    }

    async function createStripeCustomer() {
        try {
            if (!state.value.user) throw new Error("User not found")

            const customer = await $Stripe.createCustomer(state.value.user?.email)
            if (!customer) throw new Error("Customer failed to create")

            const stripePaymentProfile: User["stripePaymentProfile"] = {
                customerId: customer.id,
                paymentMethods: [],
            }

            console.log(state.value.user.id)

            await updateObject<User>(`/users/${state.value.user.id}`, { stripePaymentProfile })

            state.value.user.stripePaymentProfile = stripePaymentProfile
        } catch (error) {
            console.error(error)
        }
    }

    async function addPaymentMethod(paymentMethod: PaymentMethod) {
        try {
            await $fetch(`/api/users/${state.value.user?.id}/payment-methods`, {
                method: "POST",
                body: { paymentMethod },
            })

            state.value.user?.stripePaymentProfile?.paymentMethods.push(paymentMethod)
        } catch (error) {
            console.error(error)
        }
    }

    async function addPaymentRecord(projectId: Project["id"], paymentRecord: PaymentRecord) {
        if (!projectId) throw new Error("no prohject id")

        try {
            await $fetch(`/api/users/${state.value.user?.id}/payment-record`, {
                method: "POST",
                body: {
                    paymentRecord,
                    projectId,
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    async function deletePaymentProfile(paymentMethodId: PaymentMethod["paymentMethodId"]) {
        const paymentProfileIndex = state.value.user?.stripePaymentProfile.paymentMethods.findIndex((profile) => {
            return profile.paymentMethodId === paymentMethodId
        })

        if (paymentProfileIndex === -1) throw new Error("No profile found")
        const paymentProfile = state.value.user?.stripePaymentProfile.paymentMethods[paymentProfileIndex]
        state.value.user?.stripePaymentProfile.paymentMethods.splice(paymentProfileIndex, 1)

        try {
            await $fetch(`/api/users/${state.value.user?.id}/methods/${paymentMethodId}`, {
                method: "DELETE",
            })

            writeCache(state.value.user!)
        } catch (error) {
            state.value.user?.stripePaymentProfile.paymentMethods.push(paymentProfile)
            console.error(error)
        }
    }

    function writeCache(user: User) {
        if (!import.meta.client) return
        localStorage.setItem("user", JSON.stringify(user))
    }

    function logout() {
        state.value.user = null
        localStorage.removeItem("user")
        localStorage.removeItem("jwt")

        return navigateTo("/")
    }
    return {
        state, // Keep state to allow mutations
        isStaff,
        getStripeCustomerId,
        getReciepts,
        stripeCustomerId,
        stripePaymentProfile,
        logout,
        login,
        register,
        addPaymentMethod,
        validateJwt,
        init,
        createStripeCustomer,
        deletePaymentProfile,
        paymentMethods,
        email,
    }
})
