import { defineStore } from "pinia"

export const useAppStore = defineStore("appStore", {
    state: () => ({
        app: {
            loading: false,
            initialized: false,
        },
    }),

    getters: {
        get(state) {
            return state.app
        },

        loading(state) {
            return state.app.loading
        },

        initialized(state) {
            return state.app.initialized
        },
    },

    actions: {
        setInitialized(bool: boolean) {
            this.app.initialized = bool
        },

        /**A promise that resolves when the dashboard has loaded completely. */
        async appStart() {
            while (!this.app.initialized) {
                await new Promise((resolve) => setTimeout(resolve, 50))
            }
        },
    },
})
