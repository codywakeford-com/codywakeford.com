import type { Unsubscribe } from "firebase/firestore"
interface State {
    projectListeners: Unsubscribe[]
    userListeners: Unsubscribe[]
}
export const useAppStore = defineStore("appStore", () => {
    const state = ref<State>({
        projectListeners: [],
        userListeners: [],
    })

    function unsubUser() {
        for (let unsub of state.value.userListeners) {
            unsub()
        }

        state.value.userListeners = []
    }

    function unsubProject() {
        for (let unsub of state.value.projectListeners) {
            unsub()
        }

        state.value.projectListeners = []
    }

    function unsub() {
        unsubUser()
        unsubProject()
    }
    return { state, unsub, unsubProject, unsubUser }
})
