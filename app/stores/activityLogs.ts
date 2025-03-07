import { defineStore } from "pinia"

interface State {
    log: ActivityItem[]
}

export const useActivityLogStore = defineStore(
    "activityLog",
    () => {
        const state = ref<State>({
            log: [],
        })

        const log = computed(() => state.value.log)

        const getByProjectId = computed(() => {
            return (projectId: string) => {
                return state.value.log.filter((i) => i.projectId === projectId)
            }
        })

        const getIndexByProjectId = computed(() => {
            return (projectId: Project["id"]) => {
                return state.value.log.findIndex((log) => log.projectId === projectId)
            }
        })

        return {
            state,
            log,
            getByProjectId,
            getIndexByProjectId,
        }
    },
    { persist: true },
)
