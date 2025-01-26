export {}

declare global {
    interface AppNotification {
        id: string
        title: string
        type: "store" | "order" | "blog" | "client" | "project"
        mode: "success" | "info" | "warning" | "danger"
        message: string
        read: boolean
        to: string[]
        style: {
            icon: string
            backgroundColor: string
        }
        action: {
            type: "link" | "none"
            url?: string
        }
        timestamp: string
    }

    interface CreateNotification
        extends Omit<AppNotification, "read" | "id" | "style" | "action" | "timestamp"> {
        read?: boolean
        action?: {
            type?: "link" | "none"
            url?: string
        }
        to: string[]
        style?: {
            icon: string
            backgroundColor: string
        }
        timestamp?: string
    }
}
