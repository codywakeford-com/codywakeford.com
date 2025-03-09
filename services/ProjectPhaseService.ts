import ActionService from "./ActionService"
import ActivityLogService from "./ActivityLogService"
import DbService from "./DbService"

// Returns true if able to move to next phase
type PhaseHandler = (project: Project) => Promise<boolean>

const phaseHandlers: Record<ProjectPhase, PhaseHandler> = {
    discovery: async (project) => {
        if (!project.quote) throw new Error("quote not found")

        if (project.quote.amountPaid / project.quote.totalAmount < 0.33) {
            await ActivityLogService.addSystemMessageActivityItem(
                project.id,
                "Great, I'm happy you want to move forward with my services. To continue with the project please make the initial downpayment of a minimum of 33%.",
                ["payment"],
            )

            await ActionService.createUserAction(
                project.id,
                "payment",
                "In order to move forward with the design I ask you make a minimum of 33% of the payment.",
            )
            return false
        }

        await ActionService.createUserAction(
            project.id,
            "book-meeting",
            "Welcome to our project. To start, book your design meeting where we gather all the details to shape the website's structure.",
        )

        await ActivityLogService.addPhaseActivityItem(project.id, "design")

        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Thank you for choosing me. Let's book our design call and get this project underway. Book a call using the action menu in the top right of the dashboard.",
        )
        return true
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
            return false
        }

        await ActivityLogService.addPhaseActivityItem(project.id, "development")
        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "I'm glad your happy with the design! Now, I'll start developing the project. Check back here for updates!",
        )
        return true
    },

    development: async (project) => {
        await ActivityLogService.addPhaseActivityItem(project.id, "testing")
        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Development is mostly complete all that is left is the testing. This step is crucial to ensure your website runs smoothly without any problems. I will write code that tests all the failure points and security weakpoints.",
        )

        return true
    },

    testing: async (project) => {
        await ActionService.createUserAction(
            project.id,
            "book-meeting",
            "The website is built and tested! Book a meeting to review the final version before launch.",
        )
        await ActivityLogService.addPhaseActivityItem(project.id, "launch")
        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Everything is ready and tested! Please book a call for the final review.",
        )

        return true
    },

    launch: async (project) => {
        if (!project.quote) throw new Error("quote not found")

        if (project.quote.amountPaid / project.quote.totalAmount < 1) {
            await ActionService.createUserAction(
                project.id,
                "payment",
                "Please make the final payment before I launch your website.",
            )
            await ActivityLogService.addSystemMessageActivityItem(
                project.id,
                "Now the website is complete and your completely happy with it, all that is left is to move the website onto your live domain. Please make the final payment and I'll get started.",
            )
            return false
        }

        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Now all thats left to do is move the website onto your live domain. This may take up to 24 hours but is usually much faster. You'll be notified when its ready!",
        )

        await ActivityLogService.addPhaseActivityItem(project.id, "live")
        return true
        // TODO: await client reveiw and final approval
        //
        // TODO: add conclusion package: website overview, links etc
    },

    live: async (project) => {
        await ActivityLogService.addSystemMessageActivityItem(
            project.id,
            "Your website is now live! Check it out on your domain.",
        )
        return true
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

        const canMoveToNextPhase = await handler(project)

        console.log(canMoveToNextPhase)

        if (canMoveToNextPhase) {
            await this.updatePhase(project.id, this.getNextPhase(project.phase))
        }
    }
}

const phases: Project["phase"][] = ["discovery", "design", "development", "testing", "launch", "live"]
