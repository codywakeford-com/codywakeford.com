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
        smallImageUrl: string | undefined
        size: number /** Size in byes */
        mime: MIMEType
        lastModified: number
        sender: User["email"]
        signed?: boolean
        timestamp: number
        projectId: Project["id"]
    }
}
