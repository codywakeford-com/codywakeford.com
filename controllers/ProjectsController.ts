import ActionService from "~~/services/ActionService"
import ActivityLogService from "~~/services/ActivityLogService"
import DbService from "~~/services/DbService"
import ProjectPhaseService from "~~/services/ProjectPhaseService"
import ProjectService from "~~/services/ProjectService"
import ActionController from "./ActionsController"

export default class ProjectController {
    static async createProject(emails: string[]) {
        try {
            const projectId = await ProjectService.create(emails)

            if (!projectId) throw new Error("Error")

            await ActionService.createUserAction(
                projectId,
                "book-meeting",
                "Welcome to our project. We're glad to have you on board. To kick things of book your discovery meeting using the button below. This helps us define the project outline and allows us to generate you a quote. See you soon! ",
            )
            await ActivityLogService.addPhaseActivityItem(projectId, "discovery")
            await ActivityLogService.addSystemMessageActivityItem(
                projectId,
                "Welcome to our new project! To kick things off, book the discovery meeting. You can find action buttons at top right of this dashboard.",
            )
        } catch (error) {
            console.error(error)
        }
    }

    static async deleteProject(projectId: string) {
        const $Projects = useProjectStore()

        await DbService.deleteObject(`/projects/${projectId}`)
        $Projects.state.projects = $Projects.state.projects.filter((p) => {
            return p.id !== projectId
        })
    }

    static async addQuoteToProject(projectId: string, quoteUrl: string, proposalUrl: string, quoteAmount: number) {
        const $Projects = useProjectStore()

        if ($Projects.getByProjectId(projectId).quote?.accepted) return
        await ProjectService.addQuoteToProject(projectId, quoteUrl, proposalUrl, quoteAmount * 100)
        await ActivityLogService.addQuoteActivityItem(projectId)
        await ActionService.createUserAction(
            projectId,
            "accept-quote",
            "Now that we've had our discovery call, I've prepared a quote for you. You can accept it, message me with any questions, or book a call if you'd like to discuss any changes.",
        )
    }

    static async setDesignDocument(projectId: Project["id"], figmaLink: string) {
        await ProjectService.setDesignDocument(projectId, figmaLink)
        await ActivityLogService.addMessageActivityItem(
            projectId,
            "has uploaded the design document.",
            "codypwakeford.com",
        )

        await ActionService.createUserAction(
            projectId,
            "accept-design",
            "I have uploaded the design document for you to view.  Once your happy with the design click the button below to continue. Once the website it being built you will not be able to change the design.",
        )

        await ActivityLogService.addSystemMessageActivityItem(
            projectId,
            "I have uploaded the figma design document. Once your 100% happy with the design, you can accept it in the action menu, this will move the project into the development phase. Beware, once the website is in development no changes may be made.",
        )
    }

    static async acceptProjectProposal(projectId: Project["id"]) {
        const $User = useUserStore()

        try {
            await DbService.updateObject(`/projects/${projectId}`, { quote: { accepted: true } })
            await ActivityLogService.addMessageActivityItem(
                projectId,
                "has accepted the project proposal.",
                $User.email,
            )
            await ProjectPhaseService.incrementPhase($Projects.getByProjectId(projectId))
            await ActionController.onAccept(projectId)
        } catch (error) {
            console.error(error)
        }
    }

    static async acceptDesign(projectId: string) {
        const $Projects = useProjectStore()

        await DbService.updateObject(`/projects/${projectId}`, { design: { accepted: true } })
        await ActionController.onAcceptDesign(projectId)
        await ProjectPhaseService.incrementPhase($Projects.getByProjectId(projectId))
    }

    static async incrementPhase(projectId: string) {
        const $Projects = useProjectStore()

        await ProjectPhaseService.incrementPhase($Projects.getByProjectId(projectId))
    }
}
