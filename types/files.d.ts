export {}

declare global {
    interface FileFilters {
        search: string
        type: "any" | ProjectFile["type"]
    }

    interface ProjectFile {
        id: string
        name: string
        previewUrl: string
        downloadUrl: string
        size: number
        sender: User["email"]
        signed?: boolean
        timestamp: number
        /**File type extension. E.g pdf, docx */
        extension: string
        projectId: Project["id"]
    }
}
