export {}

declare global {
    interface Chatroom {
        projectId: string
        messages: Message[]
    }

    interface Message {
        id: string
        message: string
        sender: string
        timestamp: FieldValue
        files: string[]
    }
}
