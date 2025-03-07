import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage"
import DbService from "./DbService"

export default class FilesService {
    static async uploadToFirebase(path: string, file: File) {
        const $storage = useStorage()
        const fileStorageRef = storageRef($storage, path)

        try {
            await uploadBytes(fileStorageRef, file)
            const url = await getDownloadURL(fileStorageRef)

            return url
        } catch (error) {
            console.error(error)
        }
    }

    static async addFileToProject(projectId: string, file: File, sender: User["email"]) {
        try {
            const url = await this.uploadToFirebase(`/projects/${projectId}/files`, file)

            if (!url) throw new Error()

            const projectFile: ProjectFile = {
                id: uuid(),
                name: file.name,
                size: file.size,
                sender: sender,
                timestamp: Date.now(),
                projectId,
                url: url,
                extension: file.name.split(".")[1] || "",
            }

            await DbService.createObject<ProjectFile>(`/projects/${projectId}/files`, projectFile)

            return projectFile
        } catch (error) {
            console.error(error)
        }
    }
}
