export {}

declare global {
    interface Meeting {
        id: string
        projectId: string

        meetingUrl: string
        cancelUrl: string
        rescheduleUrl: string

        name: string

        timestamp: number
        startTime: number

        clients: {
            name: string
            email: string
        }[]

        status: MeetingStatus
    }

    type MeetingStatus =
        | "scheduled"
        | "in-progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
        | "no-show"
        | "postponed"
}
