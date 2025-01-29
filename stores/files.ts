import { defineStore } from "pinia"
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage"
import imageCompression from "browser-image-compression"

import Fuse from "fuse.js"
import { collection, onSnapshot } from "firebase/firestore"
export const useFileStore = defineStore("file", {
    state: () => ({
        files: [] as ProjectFile[],
        recentFiles: [] as ProjectFile["id"][],
    }),

    getters: {
        get(state) {
            return state.files
        },

        getRecent: (state) => (number: number) => {
            const sortedFiles = state.files.sort((a, b) => {
                return a.timestamp - b.timestamp
            })

            if (!sortedFiles.length) return []

            return sortedFiles.slice(0, number)
        },

        getFileById: (state) => (fileId: string) => {
            const file = state.files.find((file) => file.id === fileId)

            if (file) return file
        },

        getFilesByIds: (state) => (fileIds: string[]) => {
            return state.files.filter((file) => {
                return fileIds.includes(file.id)
            })
        },

        getFilesByProjectId: (state) => (projectId: string) => {
            return state.files.filter((file) => file.projectId === projectId)
        },

        filterFiles: (state) => (filters: FileFilters) => {
            let filteredFiles = state.files || []

            if (filters.search) {
                const fuse = new Fuse(filteredFiles, {
                    keys: ["name", "extension", "type"],
                    threshold: 0.3,
                })

                const results = fuse.search(filters.search)

                filteredFiles = results.map((result) => result.item)
            }

            if (filters.type !== "any") {
                filteredFiles = filteredFiles.filter((file) => {
                    return file.type === filters.type
                })
            }

            return filteredFiles
        },
    },

    actions: {
        async init() {
            let projectIds: string[] = []
            try {
                projectIds = await $fetch<Project["id"][]>(`/api/projects/${$User.email}`)
            } catch (error) {
                console.error(error)
            }

            const $db = useDb()
            for (let id of projectIds) {
                const colRef = collection($db, `projects/${id}/files`)

                onSnapshot(colRef, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        const fileData = change.doc.data()

                        const file = { id: change.doc.id, ...fileData } as ProjectFile

                        if (change.type === "added") {
                            const index = this.files.findIndex((afile) => {
                                return afile.id === file.id
                            })

                            if (index === -1) {
                                this.files.push(file)
                            }
                        }
                    })
                })
            }

            // this.read()
        },

        async read() {
            try {
                const response = await $fetch<ProjectFile[]>(`/api/files/${$User.email}`, {
                    method: "GET",
                })

                this.files = response
            } catch (error) {
                console.error(error)
            }
        },

        async resizeImage(file: File, width: number, height: number) {
            const options = {
                maxWidthOrHeight: Math.min(width, height),
                initialQuality: 0.75,
            }

            const resizedImage = await imageCompression(file, options)

            return resizedImage
        },

        /** Upload a file to firebase storage */
        async uploadToFirebase(path: string, file: File) {
            const $storage = useStorage()

            const fileStorageRef = storageRef($storage, path)

            try {
                await uploadBytes(fileStorageRef, file)
                const url = await getDownloadURL(fileStorageRef)

                return url
            } catch (error) {
                console.error(error)
            }
        },

        /** Adds a file object to firestore */
        async addFileToProject(projectId: string, file: Omit<ProjectFile, "id">) {
            try {
                const fileId = await $fetch<ProjectFile["id"]>(`/api/projects/${projectId}/files`, {
                    method: "POST",
                    body: { file },
                })

                return fileId
            } catch (error) {
                console.error(error)
            }
        },

        /**Uploads files to firebase and adds them to a project */
        async saveFiles(projectId: string, files: File[], sender: User["email"]) {
            const fileIds: string[] = []

            for (const file of files) {
                let fileType: ProjectFile["type"] = "document"

                const path = `${projectId}/files/${file.name}`
                let previewUrl: string | undefined

                if (file.type.startsWith("image/")) {
                    fileType = "image"
                    const previewImage = await this.resizeImage(file, 200, 200)
                    previewUrl = await $Files.uploadToFirebase(`${path}/preview`, previewImage)
                }

                const url = await $Files.uploadToFirebase(path, file)

                const document = {
                    url: url,
                    previewUrl: previewUrl,
                    name: file.name,
                    sender: sender,
                    type: fileType,
                    projectId: projectId,
                } as ProjectFile

                const docId = await this.addFileToProject(projectId, document)

                if (!docId) {
                    throw new Error("No doc id")
                }
                fileIds.push(docId)
            }

            if (fileIds.length) {
                $ActivityLogs.addFilesActivityItem(projectId, fileIds)
            }

            return fileIds
        },
    },
})
