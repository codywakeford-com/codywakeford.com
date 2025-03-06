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

    const actions = computed(() => state.value.actions)

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
            return state.value.actions.filter((a) => a.projectId === projectId && a.status === "pending")
        }
    })

    return {
        state,
        actions,
        getByActionId,
        getByProjectId,
        getPendingByProjectId,
    }

    // async function markAsComplete(actionId: Action["id"]) {
    //     const action = this.getByActionId(actionId);
    //
    //     if (!action) throw new Error("No action found");
    //
    //     const update: Partial<Action> = {
    //         status: "completed",
    //     };
    //
    //     await updateObject<Action>(
    //         `/projects/${action.projectId}/user-required-actions/${action.id}`,
    //         update,
    //     );
    //
    //     this.selectedActionId = null;
    // }
})
