import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage"

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

    static async addFileToProject(projectId: string, file: Omit<ProjectFile, "id">) {
        try {
            const fileId = await $fetch<ProjectFile["id"]>(`/api/projects/${projectId}/files`, {
                method: "POST",
                body: { file },
            })

            return fileId
        } catch (error) {
            console.error(error)
        }
    }
}
