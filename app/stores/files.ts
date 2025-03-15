import { defineStore } from "pinia"

import Fuse from "fuse.js"
import { truncate } from "fs"

interface State {
    files: ProjectFile[]
}

export const useFileStore = defineStore(
    "file",
    () => {
        const state = ref<State>({
            files: [],
        })

        const getByFileId = computed(() => (fileId: string) => {
            return state.value.files.find((f) => f.id === fileId)
        })

        const getRecent = computed(() => (count: number) => {
            return state.value.files.slice(0, count)
        })

        const formatSize = computed(() => (sizeInBytes: number): string => {
            if (sizeInBytes >= 1024 * 1024) {
                return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB"
            } else {
                return (sizeInBytes / 1024).toFixed(2) + " KB"
            }
        })

        const truncateName = computed(() => (fileName: string, length: number): string => {
            return fileName.length < length
                ? fileName
                : `${fileName
                      .split("")
                      .splice(0, length - 2)
                      .join("")}...`
        })

        const getFilesByIds = computed(() => (fileIds: string[]) => {
            return state.value.files.filter((f) => fileIds.includes(f.id))
        })

        const getByProjectId = computed(() => (projectId: string) => {
            return state.value.files.filter((f) => f.projectId === projectId)
        })

        const filterFiles = computed(() => {
            return (filters: FileFilters) => {
                let filteredFiles = state.value.files || []

                if (filters.search) {
                    const fuse = new Fuse(filteredFiles, {
                        keys: ["name", "extension", "type"],
                        threshold: 0.3,
                    })

                    const results = fuse.search(filters.search)

                    filteredFiles = results.map((result) => result.item)
                }

                return filteredFiles
            }
        })

        return { state, getByProjectId, truncateName, getByFileId, getFilesByIds, filterFiles, getRecent, formatSize }
    },
    { persist: false },
)
