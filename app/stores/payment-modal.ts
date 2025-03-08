import { defineStore } from "pinia"
interface State {
    ui: "payment" | "save-card"
    paymentAmount: number | undefined
}
export const useBillingModalStore = defineStore(
    "billingModal",
    () => {
        const state = ref<State>({
            ui: "payment",
            paymentAmount: undefined,
        })

        const type = computed(() => state.value.ui)

        function openAddCardModal() {
            state.value.ui = "save-card"
            showModalById("payment-modal")
        }

        function openPaymentModal(amountToPay: number) {
            state.value.ui = "payment"
            state.value.paymentAmount = Math.floor(amountToPay * 100)
            showModalById("payment-modal")
        }

        return { state, type, openAddCardModal, openPaymentModal }
    },
    { persist: true },
)
