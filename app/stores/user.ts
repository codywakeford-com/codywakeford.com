import { defineStore } from "pinia"

interface State {
    user: User
    jwt: string | null
    isLoading: boolean
    paymentMethods: PaymentMethod[]
    isLoggedIn: boolean
}

export const useUserStore = defineStore(
    "userStore",
    () => {
        const state = ref<State>({
            user: {
                firstName: "John",
                lastName: "Doe",
                id: "guest-user-id",
                profileColor: "ffffff",
                password: "hello",
                email: "guest user",
                role: "user",
                customerId: "",
            },

            isLoggedIn: false,

            jwt: null,
            isLoading: true,
            paymentMethods: [],
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
            return state.value.user.customerId
        })

        const paymentMethods = computed(() => {
            return state.value.paymentMethods || []
        })

        function setUser(user: User, jwt: string) {
            state.value.jwt = jwt
            localStorage.setItem("jwt", jwt)

            state.value.user = user
            state.value.isLoggedIn = true
        }

        function setNullUserObj() {
            state.value.user = {
                id: "a",
                firstName: "Guest",
                lastName: "User",
                profileColor: "ffffff",
                email: "guest@email.com",
                password: "sogbndg",
                role: "user",
                customerId: "123",
            }
            state.value.isLoggedIn = false
            state.value.paymentMethods = []
        }

        return {
            state,
            isStaff,
            getStripeCustomerId,
            paymentMethods,
            email,
            user,
            setNullUserObj,
            setUser,
        }
    },
    { persist: true },
)
