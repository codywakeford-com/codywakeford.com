import { collection, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

export const useActivityLogStore = defineStore("activityLog", {
    state: () => ({
        activityLogs: [] as ActivityLog[],
    }),

    getters: {
        get(state): ActivityLog[] {
            return state.activityLogs
        },

        getByProjectId:
            (state) =>
            (projectId: Project["id"]): ActivityLog => {
                const log = state.activityLogs.find((log) => {
                    return log.projectId === projectId
                })
                return (
                    log || {
                        projectId,
                        activity: [],
                    }
                )
            },

        getIndexByProjectId: (state) => (projectId: Project["id"]) => {
            const index = state.activityLogs.findIndex((log) => {
                return log.projectId === projectId
            })

            return index
        },
    },

    actions: {
        async init() {
            let projectIds: string[] = []
            try {
                projectIds = await $fetch<Project["id"][]>(`/api/projects/${$User.email}`)
            } catch (error) {
                console.error(error)
            }

            const $db = useDb()
            for (let id of projectIds) {
                const colRef = collection($db, `projects/${id}/activity-log`)

                onSnapshot(colRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        const activityLogData = change.doc.data()

                        const activityItem = { id: change.doc.id, ...activityLogData } as $ActivityItem

                        if (change.type === "added") {
                            const log = this.activityLogs.find((log) => {
                                return log.projectId === id
                            })

                            if (!log) {
                                this.activityLogs.push({
                                    projectId: id,
                                    activity: [activityItem],
                                })
                                return
                            }

                            const index = log.activity.findIndex((item) => {
                                return item.id === activityItem.id
                            })

                            if (index === -1) {
                                log.activity = [...log.activity, activityItem].sort((a, b) => a.timestamp - b.timestamp)
                            }

                            return
                        }
                    })
                })
            }
        },

        async create(projectId: Project["id"], activity: ActivityItem) {
            try {
                await $fetch(`/api/projects/${projectId}/activity-log`, {
                    method: "POST",
                    body: { activity },
                })
            } catch (error) {
                console.error(error)
            }
        },

        async addFilesActivityItem(projectId: Project["id"], fileIds: ProjectFile["id"][]) {
            const item = {
                type: "attachment",
                files: fileIds,
                timestamp: Date.now(),
            } as AttachmentActivityItem

            await this.create(projectId, item)
        },

        async addQuoteActivityItem(projectId: Project["id"]) {
            const item = {
                type: "quote",
                projectId: projectId,
                timestamp: Date.now(),
            } as QuoteActivityItem

            await this.create(projectId, item)
        },

        async addMessageActivityItem(
            projectId: Project["id"],
            message: MessageActivityItem["message"],
            sender: User["email"]
        ) {
            const item = {
                sender: sender,
                type: "message",
                timestamp: Date.now(),
                message: message,
            } as MessageActivityItem

            await this.create(projectId, item)
        },

        async addSystemMessageActivityItem(
            projectId: Project["id"],
            message: SystemMessageActivityItem["message"],
            actions: Action["id"][]
        ) {
            const item: SystemMessageActivityItem = {
                id: uuid(),
                message: message,
                type: "system-message",
                timestamp: Date.now(),
                actions,
                sender: "system",
            }

            await this.create(projectId, item)
        },

        async addMeetingActivityItem(projectId: Project["id"], update: MeetingActivityItem["update"]) {
            const item: MeetingActivityItem = {
                id: uuid(),
                sender: $User.email,
                update: update,
                type: "meeting",
                timestamp: Date.now(),
                actions: [],
            }

            await this.create(projectId, item)
        },
        async addPhaseActivityItem(projectId: Project["id"], phaseTo: ProjectPhase) {
            const item = {
                type: "phase",
                timestamp: Date.now(),
                phaseTo: phaseTo,
            } as PhaseActivityItem

            await this.create(projectId, item)
        },

        async read(projectIds: Project["id"][]) {
            for (let i of projectIds) {
                try {
                    const response = await $fetch<ActivityLog>(`/api/projects/${i}/activity-log`)
                    this.activityLogs.push(response)
                } catch (error) {
                    console.error(error)
                }
            }
        },
    },
})
