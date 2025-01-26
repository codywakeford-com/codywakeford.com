export {}

declare global {
    interface BaseActivityItem {
        id: string
        type: string
        timestamp: number
    }

    interface ActionActivityItem extends BaseActivityItem {
        type: "action"
        action: Actions
        message?: string
    }

    interface AttachmentActivityItem extends BaseActivityItem {
        type: "attachment"
        files: ProjectFile["id"][]
    }

    interface MessageActivityItem extends BaseActivityItem {
        type: "message"
        sender: string
        level: "success" | "danger" | "neutral"
        message: string
    }

    interface PhaseActivityItem extends BaseActivityItem {
        type: "phase"
        phaseTo: ProjectPhase
    }

    interface QuoteActivityItem extends BaseActivityItem {
        type: "quote"
        projectId: Project["id"]
    }

    interface SystemMessageActivityItem extends BaseActivityItem {
        type: "system-message"
        message: string
        action?: Action
    }

    interface MeetingActivityItem extends BaseActivityItem {
        type: "meeting"
        update: "changed" | "booked" | "cancelled" | "proposed"
        sender: User["email"]
    }

    type $ActivityItem =
        | ActionActivityItem
        | AttachmentActivityItem
        | MessageActivityItem
        | PhaseActivityItem
        | QuoteActivityItem
        | MeetingActivityItem
        | SystemMessageActivityItem

    type OmitId<T> = Omit<T, "id">

    type ActivityItem = OmitId<ActivityItem>

    interface ActivityLog {
        projectId: string
        activity: $ActivityItem[]
    }
}
