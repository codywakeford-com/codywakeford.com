import { defineStore } from "pinia"

interface State {
    filters: {
        search: string
        type: ProjectFile["type"] | "any"
    }
    previewFileIndex: 0
}

export const useFilesDashboardStore = defineStore("files-dashboard", () => {
    const state: Ref<State> = ref({
        filters: {
            search: "",
            type: "any"
        },
        previewFileIndex: 0
    })

    const previewFile = computed(() => {
        return filteredFiles.value[state.value.previewFileIndex]
    })

    const filteredFiles = computed(() => {
        return $Files.filterFiles(state.value.filters)
    })

    return {
        state, filteredFiles, previewFile
    }
})
