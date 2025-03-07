import { defineStore } from "pinia"

interface State {
    meetings: Meeting[]
}
export const useMeetingStore = defineStore(
    "meetings",
    () => {
        const state = ref<State>({
            meetings: [],
        })

        const getByMeetingId = computed(() => {
            return (meetingId: string) => {
                return state.value.meetings.find((m) => m.id === meetingId)
            }
        })

        const getByProjectId = computed(() => {
            return (projectId: string) => {
                return state.value.meetings.filter((m) => m.projectId === projectId)
            }
        })

        return { state, getByProjectId, getByMeetingId }
    },
    { persist: true },
)
