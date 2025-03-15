import DbService from "./DbService"

export default class ActivityLogService {
    static async addFilesActivityItem(projectId: Project["id"], sender: User["email"], fileIds: ProjectFile["id"][]) {
        const item = {
            type: "attachment",
            files: fileIds,
            timestamp: Date.now(),
            projectId,
        } as AttachmentActivityItem

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }

    static async addQuoteActivityItem(projectId: Project["id"]) {
        const item = {
            type: "quote",
            projectId,
            timestamp: Date.now(),
        } as QuoteActivityItem

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }

    static async addMessageActivityItem(
        projectId: Project["id"],
        message: MessageActivityItem["message"],
        sender: User["email"],
    ) {
        const item = {
            sender: sender,
            type: "activity-message",
            timestamp: Date.now(),
            projectId,
            message: message,
        } as MessageActivityItem

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }

    static async addSystemMessageActivityItem(
        projectId: Project["id"],
        message: SystemMessageActivityItem["message"],
        actions: Action["id"][] = [],
    ) {
        const item: SystemMessageActivityItem = {
            id: uuid(),
            message: message,
            type: "system-message",
            timestamp: Date.now(),
            actions,
            sender: "system",
            projectId,
        }

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }

    static async addMeetingActivityItem(projectId: Project["id"], meetingId: Meeting["id"]) {
        const item: MeetingActivityItem = {
            id: uuid(),
            sender: $User.email,
            meetingId,
            type: "meeting",
            timestamp: Date.now(),
            actions: [],
            projectId,
        }

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }
    static async addPhaseActivityItem(projectId: Project["id"], phaseTo: ProjectPhase) {
        const item: PhaseActivityItem = {
            id: uuid(),
            type: "phase",
            timestamp: Date.now(),
            phaseTo: phaseTo,
            actions: [],
            sender: "system",
            projectId,
        }

        await DbService.createObject<ActivityItem>(`/projects/${projectId}/activity-log`, item)
    }

    static async read(projectIds: Project["id"][]) {
        for (let i of projectIds) {
            try {
                const response = await $fetch<ActivityLog>(`/api/projects/${i}/activity-log`)
                this.activityLogs.push(response)
            } catch (error) {
                console.error(error)
            }
        }
    }
}
