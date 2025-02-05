export { };

declare global {
    interface FileFilters {
        search: string;
        type: "any" | ProjectFile["type"];
    }

    interface ProjectFile {
        id: string;
        name: string;
        url: string;
        size: number;
        description?: string;
        sender: User["email"];
        previewUrl?: string;
        signed?: boolean;
        timestamp: number;
        type: "image" | "document";

        /**File type extension. E.g pdf, docx */
        extension: string;
        projectId: Project["id"];
    }
}
