import { defineStore } from "pinia"

interface State {
    actions: Action[]
    selectedActionId: Action["id"] | null
}

export const useActionStore = defineStore("actions", () => {
    const state = ref<State>({
        actions: [],
        selectedActionId: null,
    })

    const sortedActions = computed(() => {
        return state.value.actions.sort((a, b) => b.priority - a.priority)
    })

    const getByActionId = computed(() => {
        return (actionId: Action["id"]) => {
            return state.value.actions.find((a) => a.id === actionId)
        }
    })

    const getByProjectId = computed(() => {
        return (projectId: Project["id"]) => {
            return state.value.actions.filter((a) => a.projectId === projectId)
        }
    })

    const getPendingByProjectId = computed(() => {
        return (projectId: Project["id"]) => {
            return sortedActions.value.filter((a) => a.projectId === projectId && a.status === "pending")
        }
    })

    return {
        state,
        getByActionId,
        getByProjectId,
        getPendingByProjectId,
    }
})
