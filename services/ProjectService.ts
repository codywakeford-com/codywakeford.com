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
        console.log("herere")
        try {
            const projectId = await DbService.createObject<Project>("/projects", project)

            console.log(projectId)
            return projectId
        } catch (error) {
            console.error(error)
        }
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
