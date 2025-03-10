import { defineStore } from "pinia"

interface State {
    user: User
    jwt: string | null
    isLoading: boolean
    // reciepts: PaymentRecord[]
}

export const useUserStore = defineStore(
    "userStore",
    () => {
        const state = ref<State>({
            user: {
                id: "guest-user-id",
                email: "guest user",
                role: "user",
                stripePaymentProfile: {},
            },

            jwt: null,
            isLoading: true,
            // reciepts: [],
        })

        const email = computed<string>(() => {
            return state.value.user?.email || "No email"
        })

        const user = computed(() => {
            return state.value.user
        })

        const isStaff = computed<boolean>(() => {
            if (!state.value.user) return false
            return state.value.user.role === "staff"
        })

        const getStripeCustomerId = computed<string | undefined>(() => {
            return state.value.user?.stripePaymentProfile?.customerId || undefined
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

        function setNullUserObj() {
            state.value.user = {
                id: "hello",
                firstName: "Guest",
                lastName: "User",
                email: "guest@email.com",
                password: "sogbndg",
                role: "user",
                stripePaymentProfile: {
                    customerId: "123",
                    paymentMethods: [],
                },
            }
        }

        return {
            state, // Keep state to allow mutations
            isStaff,
            getStripeCustomerId,
            stripeCustomerId,
            stripePaymentProfile,
            paymentMethods,
            email,
            user,
            setNullUserObj,
        }
    },
    { persist: true },
)
