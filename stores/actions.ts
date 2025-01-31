import { collection, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

export const useActionStore = defineStore("actions", {
    state: () => ({
        actions: [] as Action[],
        selectedActionId: "" as Action["id"],
    }),

    getters: {
        get(state) {
            return state.actions
        },

        getByActionId: (state) => (actionId: Action["id"]) => {
            return state.actions.find((a) => {
                return a.id === actionId
            })
        },

        getByProjectId:
            (state) =>
            (projectId: Project["id"]): Action[] => {
                return state.actions.filter((a) => {
                    return a.projectId === projectId
                })
            },

        getPendingByProjectId: (state) => (projectId: Project["id"]) => {
            console.log(state.actions)
            return state.actions.filter((a) => {
                return a.projectId === projectId && a.status === "pending"
            })
        },
    },

    actions: {
        async init() {
            const projectIds = $Projects.getProjects.map((p) => {
                return p.id
            })

            for (let id of projectIds) {
                const colRef = collection(useDb(), `/projects/${id}/user-required-actions`)

                onSnapshot(colRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        const actionData = change.doc.data()

                        const action = {
                            id: change.doc.id,
                            ...actionData,
                        } as Action

                        if (change.type === "added") {
                            const index = this.actions.findIndex((a) => a.id === action.id)
                            if (index === -1) {
                                this.actions.push(action)
                            }

                            return
                        }

                        if (change.type === "modified") {
                            const index = this.actions.findIndex((a) => a.id === action.id)

                            if (index === -1) {
                                return
                            }

                            this.actions[index] = action

                            return
                        }

                        if (change.type === "removed") {
                            // Remove deleted projects from the state
                            this.actions = this.actions.filter((a) => a.id !== change.doc.id)
                        }
                    })
                })
            }
        },

        addAction() {},
        async markAsComplete(actionId: Action["id"]) {
            const action = this.getByActionId(actionId)

            if (!action) throw new Error("No action found")

            const update: Partial<Action> = {
                status: "completed",
            }

            await updateObject<Action>(`/projects/${action.projectId}/user-required-actions/${action.id}`, update)
        },
    },
})
