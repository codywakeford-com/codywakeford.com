import ActivityLogService from "~~/services/ActivityLogService"
import FilesService from "~~/services/FilesService"
import ImageService from "~~/services/ImageService"

export default class FilesController {
    static async addFilesToProject(projectId: string, userEmail: string, files: File[]) {
        let fileIds = []
        for (let file of files) {
            if (file.type.startsWith("image")) {
                await ImageService.compress(file, 80)
            }

            const projectFile: ProjectFile = await FilesService.addFileToProject(projectId, file, userEmail)

            fileIds.push(projectFile.id)
        }

        await ActivityLogService.addFilesActivityItem(projectId, fileIds)
    }
}
