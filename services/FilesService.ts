import { getDownloadURL, uploadBytes, ref as storageRef, type UploadMetadata } from "firebase/storage"
import DbService from "./DbService"
import ImageService from "./ImageService"

export namespace FilesService {
    export interface createProjectFileObjectUint8Array {
        Params: {
            projectId: string
            file: Uint8Array
            sender: User["email"]
            mime: string
            fileName: string
        }

        Return: Promise<FilesService>
    }
}
export default class FilesService {
    static async uploadToFirebase(path: string, file: File | Uint8Array, metadata?: UploadMetadata) {
        const $storage = useStorage()
        const fileStorageRef = storageRef($storage, path)

        await uploadBytes(fileStorageRef, file, metadata)
        const url = await getDownloadURL(fileStorageRef)

        return url
    }

    static async createProjectFileObject(projectId: string, file: File, sender: User["email"]) {
        const previewUrl = await this.uploadToFirebase(`/projects/${projectId}-${Date.now()}/files`, file)
        const downloadUrl = await this.uploadToFirebase(`/projects/${projectId}-${Date.now()}/files-download`, file, {
            contentType: "octet/steam",
        })

        let smallImageUrl = undefined

        if (file.type.startsWith("image")) {
            const image = await ImageService.resizeImage(file, 400, 400)
            smallImageUrl = await this.uploadToFirebase(`/projects/${projectId}-${Date.now()}/image-sm`, image)
        }

        if (!previewUrl || !downloadUrl) throw new Error()

        const projectFile: ProjectFile = {
            id: uuid(),
            smallImageUrl,
            mime: file.type,
            size: file.size,
            sender: sender,
            lastModified: file.lastModified,
            timestamp: Date.now(),
            projectId,
            previewUrl,
            downloadUrl,
            name: file.name,
        }

        return projectFile
    }

    static async addFileToProject(projectId: string, file: File, sender: User["email"]) {
        const projectFile = await FilesService.createProjectFileObject(projectId, file, sender)
        await DbService.createObject<ProjectFile>(`/projects/${projectId}/files`, projectFile)

        return projectFile
    }
}
