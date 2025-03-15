import { defineStore } from "pinia"

interface State {
    log: (ActivityItem | Message)[]
}

export const useActivityLogStore = defineStore(
    "activityLog",
    () => {
        const state = ref<State>({
            log: [],
        })

        const log = computed(() => state.value.log)

        const sortedByTimestamp = computed(() => {
            return state.value.log.sort((a, b) => a.timestamp - b.timestamp)
        })

        const getByProjectId = computed(() => {
            return (projectId: string) => {
                return sortedByTimestamp.value.filter((i) => i.projectId === projectId)
            }
        })

        const getIndexByProjectId = computed(() => {
            return (projectId: Project["id"]) => {
                return sortedByTimestamp.value.findIndex((log) => log.projectId === projectId)
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
