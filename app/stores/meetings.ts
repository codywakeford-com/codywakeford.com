import { defineStore } from "pinia"

export const useMeetingStore = defineStore(
    "meetings",
    {
        state: () => ({
            meetings: [] as Meeting[],
        }),

        getters: {
            get(state) {
                return state.meetings
            },

            getById:
                (state) =>
                (meetingId: Meeting["id"]): Meeting | undefined => {
                    return state.meetings.find((m) => {
                        return m.id === meetingId
                    })
                },

            getByProjectId:
                (state) =>
                (projectId: Project["id"]): Meeting[] => {
                    const meetings = state.meetings.filter((m) => {
                        return m.projectId === projectId
                    })

                    return meetings
                },

            getLengthByProjectId: (state) => (projectId: Project["id"]) => {
                const meetings = state.meetings.filter((m) => {
                    return m.projectId === projectId
                })

                if (!meetings) throw new Error("No project found")

                return meetings.length
            },
        },
    },
    { persist: true },
)
