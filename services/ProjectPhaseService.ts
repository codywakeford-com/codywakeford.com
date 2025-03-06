import ActivityLogService from "./ActivityLogService"
import DbService from "./DbService"

type PhaseHandler = (project: Project) => Promise<void>

const phaseHandlers: Record<ProjectPhase, PhaseHandler> = {
    discovery: async (project) => {
        if (project.quote.amountPaid / project.quote.totalAmount < 0.33) {
            await createObject(`/projects/${project.id}/user-required-actions`, {
                id: uuid(),
                timestamp: Date.now(),
                projectId: project.id,
                description: "  ",
                priority: 1000,
                action: "payment",
                status: "pending",
            })
            return
        }

        await createObject(`/projects/${project.id}/user-required-actions`, {
            id: uuid(),
            action: "book-meeting",
            priority: 1,
            status: "pending",
            timestamp: Date.now(),
            description: "Welcome to our project. To start, book your design meeting where we gather all the details to shape the website's structure.",
            projectId: project.id,
        })
    },
    design: async (project) => {
        if (project.quote.amountPaid / project.quote.totalAmount < 0.66) {
            await createObject(`/projects/${project.id}/user-required-actions`, {
                id: uuid(),
                timestamp: Date.now(),
                projectId: project.id,
                description: "To proceed with development, please pay up to 66% of the project quote.",
                priority: 1000,
                action: "payment",
                status: "pending",
            })

            await ActivityLogService.addSystemMessageActivityItem(project.id, "Before moving to development, please make the second payment (66% of project quote).")
            return
        }

        await ActivityLogService.addSystemMessageActivityItem(project.id, "Design is approved! Now, we begin development.")
    },
    development: async (project) => {
        await ActivityLogService.addSystemMessageActivityItem(project.id, "Development is mostly complete. Now, I will perform rigorous testing and security checks.")
    },
    testing: async (project) => {
        await createObject(`/projects/${project.id}/user-required-actions`, {
            id: uuid(),
            priority: 10,
            action: "book-meeting",
            status: "pending",
            timestamp: Date.now(),
            description: "The website is built and tested! Book a meeting to review the final version before launch.",
            projectId: project.id,
        })

        await ActivityLogService.addSystemMessageActivityItem(project.id, "Everything is ready! Please book a call for the final review.")
    },
    launch: async (project) => {
        if (project.quote.amountPaid / project.quote.totalAmount < 1) {
            const paymentAction = {
                id: uuid(),
                priority: 10,
                action: "payment",
                status: "pending",
                timestamp: Date.now(),
                description: "Please make the final payment before we launch your website.",
                projectId: project.id,
            }

            await createObject(`/projects/${project.id}/user-required-actions`, paymentAction)

            await ActivityLogService.addSystemMessageActivityItem(project.id, "Final payment required before launching your website!", [paymentAction.id])

            return
        }

        await ActivityLogService.addSystemMessageActivityItem(project.id, "Your website is now live! Check it out on your domain.")
    },
}

export default class ProjectPhaseService {
    static async updatePhase() {
        await DbService.updateObject(`/projects/${projectId}`, { phase })
    }

    static async incrementPhase(project: Project) {
        if (!project || !project.quote) throw new Error("Invalid State")

        const handler = phaseHandlers[project.phase]
        if (handler) {
            await handler(project)
            await this.updatePhase(projectId, this.getNextProjectPhase(project.phase))
        }
    }
}
