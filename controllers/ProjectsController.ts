import ActionService from "~~/services/ActionService"
import ActivityLogService from "~~/services/ActivityLogService"
import DbService from "~~/services/DbService"
import ProjectService from "~~/services/ProjectService"

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
            // await ActivityLogService.addSystemMessageActivityItem(projectId, "Welcome to our new project! To kick things off, book the discovery meeting. You can find action buttons at top right of this dashboard.", [action.id])
        } catch (error) {
            console.error(error)
        }
    }

    static async deleteProject(projectId: string) {
        await DbService.deleteObject(`/projects/${projectId}`)
        $Projects.state.projects = $Projects.state.projects.filter((p) => {
            return p.id !== projectId
        })
    }

    static async updatePhase(projectId: string, phase: ProjectPhase) {
        try {
            await updateObject(`/projects/${projectId}`, { phase })

            ActivityLogService.addPhaseActivityItem(projectId, phase)
        } catch (error) {
            console.error(error)
        }
    }

    static async addQuoteToProject(projectId: string, quoteUrl: string, proposalUrl: string, quoteAmount: number) {
        await ProjectService.addQuoteToProject(projectId, quoteUrl, proposalUrl, quoteAmount)
        await ActivityLogService.addQuoteActivityItem(projectId)
        await ActionService.createUserAction(
            projectId,
            "accept-quote",
            "Now that we've had our discovery call, I've prepared a quote for you. You can accept it, message me with any questions, or book a call if you'd like to discuss any changes.",
        )
    }

    static async clientAcceptsDesign(projectId: Project["id"]) {
        const update = {
            design: {
                accepted: true,
            },
        }
        await updateObject<Project>(`/projects/${projectId}`, update)

        await this.incrementPhase(projectId)
    }

    static async setDesignDocument(projectId: Project["id"], figmaLink: string) {
        await ProjectService.setDesignDocument(projectId, figmaLink)
        await ActivityLogService.addMessageActivityItem(projectId, "has uploaded the design document.", "codypwakeford.com")
        await ActionService.createUserAction(
            projectId,
            "accept-design",
            "I have uploaded the design document for you to view. The design needs to be finilized before moving to development. Once your happy with the design click the button below to continue. Once the website it being built you will not be able to change the design.",
        )
        await ActivityLogService.addSystemMessageActivityItem(
            projectId,
            "When your 100% happy with the design, you accept it in the action menu. This will move the project into the development phase. Beware, once the website is in development no changes may be made.",
            [action.id],
        )
    }

    static async acceptProjectProposal(projectId: Project["id"], actionId: Action["id"]) {
        const quote = this.getProjectById(projectId)?.quote
        if (!quote) throw new Error("Quote not found")

        try {
            const update = {
                quote: { accepted: true },
            }

            await updateObject(`/projects/${projectId}`, update)

            ActivityLogService.addMessageActivityItem(projectId, "has accepted the project proposal.", $User.email)

            if (quote && quote.amountPaid < quote.totalAmount / 3) {
                const action: Action = {
                    id: uuid(),
                    priority: 1,
                    action: "payment",
                    status: "pending",
                    timestamp: Date.now(),
                    description: "Great, now the project is underway. Before moving to the design phase I ask you pay a minimum of 1 third of the quote.",
                    projectId,
                }

                createObject(`/projects/${projectId}/user-required-actions`, action)

                ActivityLogService.addSystemMessageActivityItem(
                    projectId,
                    "To progress to the design phase you need to pay a minimum of 1 third of the quote cost.",
                    [action.id],
                )
            }

            $Actions.markAsComplete(actionId)
        } catch (error) {
            console.error(error)
        }
    }
}
