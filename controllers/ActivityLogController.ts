import ActivityLogService from "~~/services/ActivityLogService"
import FilesService from "~~/services/FilesService"
import MessageService from "~~/services/MessageService"

export default class ActivityLogController {
    static async sendMessage(projectId: string, message: string, files: File[]) {
        const fileUrls: string[] = []
        for (let file of files) {
            const url = await FilesService.addFileToProject(projectId, file, $User.email)

            fileUrls.push(url)
        }

        await MessageService.sendMessage(projectId, $User.email, message, fileUrls)
    }
}
