import { defineStore } from "pinia"
interface State {
    ui: "book" | "reschedule"
    url: string
    rescheduleUrl: string | null
}
export const useCalendlyStore = defineStore("calendlyStore", () => {
    const state = ref<State>({
        ui: "book",
        url: "https://calendly.com/codypwakeford/meeting",
        rescheduleUrl: null,
    })

    const type = computed(() => state.value.ui)

    function open() {
        const modal = document.getElementById("calendlyPopupModal") as HTMLElement | null

        if (!modal) return

        modal.classList.remove("hidden")
    }

    function openReschedule(url: string) {
        state.value.rescheduleUrl = url

        open()
    }

    function close() {
        state.value.rescheduleUrl = null
        const modal = document.getElementById("calendlyPopupModal") as HTMLElement | null

        if (!modal) return

        modal.classList.add("hidden")
    }
    return { state, type, close, open, openReschedule }
})
