import { defineStore } from "pinia"
interface State {
    ui: "payment" | "save-card"
}
export const useBillingModalStore = defineStore(
    "billingModal",
    () => {
        const state = ref<State>({
            ui: "payment",
        })

        const type = computed(() => state.value.ui)

        function openAddCardModal() {
            state.value.ui = "save-card"
            showModalById("payment-modal")
        }

        function openPaymentModal() {
            state.value.ui = "payment"
            showModalById("payment-modal")
        }

        return { state, type, openAddCardModal, openPaymentModal }
    },
    { persist: true },
)
