import ActionService from "./ActionService"
import ActivityLogService from "./ActivityLogService"
import DbService from "./DbService"

type PhaseHandler = (project: Project) => Promise<void>

const phaseHandlers: Record<ProjectPhase, PhaseHandler> = {
    discovery: async (project) => {
        if (!project.quote) throw new Error("quote not found")

        if (project.quote.amountPaid / project.quote.totalAmount < 0.33) {
            await ActionService.createUserAction(
                project.id,
                "payment",
                "In order to move forward with the design I ask you make a minimum of 33% of the payment.",
            )
            return
        }

        await ActionService.createUserAction(
            project.id,
            "book-meeting",
            "Welcome to our project. To start, book your design meeting where we gather all the details to shape the website's structure.",
        )
    },

    design: async (project) => {
        if (!project.quote) throw new Error("quote not found")

        if (project.quote.amountPaid / project.quote.totalAmount < 0.66) {
            await ActionService.createUserAction(
                project.id,
                "payment",
                "To proceed to the development phase, please pay a minimum of 66% of the project quote.",
            )

            await ActivityLogService.addSystemMessageActivityItem(
                project.id,
                "Before moving to development, please make the second payment (66% of project quote).",
            )
            return
        }

        await ActivityLogService.addSystemMessageActivityItem(project.id, "Design is approved! Now, we begin development.")
    },

    development: async (project) => {
        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Development is mostly complete. Now, I will perform rigorous testing and security checks.",
        )
    },

    testing: async (project) => {
        await ActionService.createUserAction(
            project.id,
            "book-meeting",
            "The website is built and tested! Book a meeting to review the final version before launch.",
        )
        await ActivityLogService.addSystemMessageActivityItem(project.id, "Everything is ready! Please book a call for the final review.")
    },

    launch: async (project) => {
        if (!project.quote) throw new Error("quote not found")

        if (project.quote.amountPaid / project.quote.totalAmount < 1) {
            await ActionService.createUserAction(project.id, "payment", "Please make the final payment before we launch your website.")
            await ActivityLogService.addSystemMessageActivityItem(project.id, "Final payment required before launching your website!", [paymentAction.id])
            return
        }

        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Now all thats left to do is move the website onto your live link. This may take up to 24 hours but is usually much faster. You'll be notified when its ready!",
        )
    },

    live: async (project) => {
        await ActivityLogService.addSystemMessageActivityItem(project.id, "Your website is now live! Check it out on your domain.")
    },
}

export default class ProjectPhaseService {
    static async updatePhase(projectId: string, newPhase: ProjectPhase) {
        await DbService.updateObject(`/projects/${projectId}`, { phase: newPhase })
    }

    static getNextPhase(phase: Project["phase"]): Project["phase"] {
        const index = phases.indexOf(phase)

        if (index === phases.length) return phase

        return phases[index + 1] as Project["phase"]
    }

    static async incrementPhase(project: Project) {
        const handler = phaseHandlers[project.phase]
        if (!handler) throw new Error("phase not found")

        await handler(project)
        await this.updatePhase(project.id, this.getNextPhase(project.phase))
    }
}

const phases: Project["phase"][] = ["discovery", "design", "development", "testing", "launch", "live"]
