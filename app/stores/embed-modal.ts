import { defineStore } from "pinia"
interface State {
    embedUrl: string
    embedMime: string
}
export const useEmbedModalStore = defineStore(
    "embedModal",
    () => {
        const state = ref<State>({
            embedUrl: "",
            embedMime: "",
        })

        function open(embedUrl: string, embedMime: string) {
            state.value.embedUrl = embedUrl
            state.value.embedMime = embedMime

            showModalById("embed-modal")
        }

        function close() {
            closeModalById("embed-modal")

            state.value.embedUrl = ""
            state.value.embedMime = ""
        }

        return { state, open, close }
    },
    { persist: true },
)
