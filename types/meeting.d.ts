export {}

declare global {
    interface Meeting {
        id: string

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
    enum MeetingStatus {
        Scheduled = "Scheduled",
        InProgress = "In Progress",
        Completed = "Completed",
        Cancelled = "Cancelled",
        Rescheduled = "Rescheduled",
        Pending = "Pending",
        NoShow = "No-Show",
        Postponed = "Postponed",
    }
}
