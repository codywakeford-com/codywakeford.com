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

        //
        // async function createStripeCustomer() {
        //     try {
        //         if (!state.value.user) throw new Error("User not found")
        //
        //         const customer = await $Stripe.createCustomer(state.value.user?.email)
        //         if (!customer) throw new Error("Customer failed to create")
        //
        //         const stripePaymentProfile: User["stripePaymentProfile"] = {
        //             customerId: customer.id,
        //             paymentMethods: [],
        //         }
        //
        //         console.log(state.value.user.id)
        //
        //         await updateObject<User>(`/users/${state.value.user.id}`, {
        //             stripePaymentProfile,
        //         })
        //
        //         state.value.user.stripePaymentProfile = stripePaymentProfile
        //     } catch (error) {
        //         console.error(error)
        //     }
        // }
        //
        // async function addPaymentMethod(paymentMethod: PaymentMethod) {
        //     try {
        //         await $fetch(`/api/users/${state.value.user?.id}/payment-methods`, {
        //             method: "POST",
        //             body: { paymentMethod },
        //         })
        //
        //         state.value.user?.stripePaymentProfile?.paymentMethods.push(paymentMethod)
        //     } catch (error) {
        //         console.error(error)
        //     }
        // }
        //
        // async function addPaymentRecord(projectId: Project["id"], paymentRecord: PaymentRecord) {
        //     if (!projectId) throw new Error("no prohject id")
        //
        //     try {
        //         await $fetch(`/api/users/${state.value.user?.id}/payment-record`, {
        //             method: "POST",
        //             body: {
        //                 paymentRecord,
        //                 projectId,
        //             },
        //         })
        //     } catch (error) {
        //         console.error(error)
        //     }
        // }
        //
        // async function deletePaymentProfile(paymentMethodId: PaymentMethod["paymentMethodId"]) {
        //     const paymentProfileIndex = state.value.user?.stripePaymentProfile.paymentMethods.findIndex((profile) => {
        //         return profile.paymentMethodId === paymentMethodId
        //     })
        //
        //     if (paymentProfileIndex === -1) throw new Error("No profile found")
        //     const paymentProfile = state.value.user?.stripePaymentProfile.paymentMethods[paymentProfileIndex]
        //     state.value.user?.stripePaymentProfile.paymentMethods.splice(paymentProfileIndex, 1)
        //
        //     try {
        //         await $fetch(`/api/users/${state.value.user?.id}/methods/${paymentMethodId}`, {
        //             method: "DELETE",
        //         })
        //
        //         writeCache(state.value.user!)
        //     } catch (error) {
        //         state.value.user?.stripePaymentProfile.paymentMethods.push(paymentProfile)
        //         console.error(error)
        //     }
        // }
        //
        // function writeCache(user: User) {
        //     if (!import.meta.client) return
        //     localStorage.setItem("user", JSON.stringify(user))
        // }

        return {
            state, // Keep state to allow mutations
            isStaff,
            getStripeCustomerId,
            getReciepts,
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
