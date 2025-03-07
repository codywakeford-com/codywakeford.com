import DbService from "./DbService"

export default class MessageService {
    static async sendMessage(projectId: string, senderEmail: string, message: string, files: string[]) {
        const messageObj: Message = {
            id: uuid(),
            timestamp: Date.now(),
            message,
            sender: senderEmail,
            type: "message",
            files: files,
            projectId,
        }

        await DbService.createObject<Message>(`/projects/${projectId}/messages`, messageObj)
    }
}
