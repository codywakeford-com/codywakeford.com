import { defineStore } from "pinia"

import Fuse from "fuse.js"
import { collection, onSnapshot } from "firebase/firestore"
export const useFileStore = defineStore(
    "file",
    {
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
                        id: uuid(),
                        url: url,
                        previewUrl: previewUrl,
                        extension: "",
                        timestamp: Date.now(),
                        name: file.name,
                        sender: sender,
                        size: file.size,
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
    },
    { persist: true },
)
