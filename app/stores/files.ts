import { defineStore } from "pinia"

import Fuse from "fuse.js"

interface State {
    files: ProjectFile[]
}

export const useFileStore = defineStore(
    "file",
    () => {
        const state = ref<State>({
            files: [],
        })

        const getByFileId = computed(() => {
            return (fileId: string) => {
                return state.value.files.find((f) => f.id === fileId)
            }
        })

        const getRecent = computed(() => {
            return (count: number) => {
                return state.value.files.slice(0, count)
            }
        })

        const getByIds = computed(() => {
            return (fileIds: string[]) => {
                return state.value.files.filter((f) => fileIds.includes(f.id))
            }
        })

        const getByProjectId = computed(() => {
            return (projectId: string) => {
                return state.value.files.filter((f) => f.projectId === projectId)
            }
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

        return { state, getByProjectId, getByFileId, getByIds, filterFiles, getRecent }
    },
    { persist: false },
)
