import DbService from "./DbService"

export default class ProjectService {
    static async create(emails: string[]) {
        const project: Project = {
            id: uuid(),
            emails: emails,
            phase: "discovery",
            type: "full",
            design: {
                accepted: false,
            },
        }
        try {
            const projectId = await DbService.createObject<Project>("/projects", project)

            console.log(projectId)
            return projectId
        } catch (error) {
            console.error(error)
        }
    }

    static async addQuoteToProject(projectId: string, quoteUrl: string, proposalUrl: string, quoteAmount: number) {
        const files: ProjectFile[] = [
            {
                id: uuid(),
                name: "project-proposal.pdf",
                projectId: projectId,
                extension: "pdf",
                sender: "codypwakeford@gmail.com",
                size: 15,
                timestamp: Date.now(),
                url: proposalUrl,
            },
            {
                id: uuid(),
                name: "project-quote.pdf",
                projectId: projectId,
                extension: "pdf",
                sender: "codypwakeford@gmail.com",
                timestamp: Date.now(),
                size: 15,
                url: quoteUrl,
            },
        ]

        files.forEach((f) => {
            DbService.createObject<ProjectFile>(`/projects/${projectId}/files`, f)
        })

        const quote: ProjectQuote = {
            amountPaid: 0,
            files: files,
            totalAmount: quoteAmount,
        }

        await DbService.updateObject<Project>(`/projects/${projectId}`, { quote: quote })
    }

    static async setDesignDocument(projectId: string, figmaLink: string) {
        const update = {
            design: {
                url: figmaLink,
            },
        }
        DbService.updateObject(`/projects/${projectId}`, update)
    }

    /* This returns all the projects the user has access to */
    static async getProjectIdsForUser(email: string) {
        try {
            const { ids } = await $fetch<Api.Projects.Email.Return>(`/api/projects/${email}`)
            return ids
        } catch (e) {}
    }
}
