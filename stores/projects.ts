import axios from "axios"
import { collection, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

export const useProjectStore = defineStore("projects", {
    state: () => ({
        projects: [] as Project[],
        selectedProjectId: "",
    }),

    getters: {
        getProjects(state) {
            return state.projects
        },

        getByEmail: (state) => (email: string) => {
            return state.projects.filter((project) => {
                for (email in project.emails) return email === email
            })
        },

        designUrl: (state) => (projectId: Project["id"]) => {
            const project = state.projects.find((project) => {
                return project.id === projectId
            })

            if (!project) return

            return project.design.url
        },

        getPhaseById: (state) => (projectId: string) => {
            const projectIndex = state.projects.findIndex((project) => {
                return project.id === projectId
            })

            return state.projects[projectIndex].phase
        },

        amountPaid: (state) => (projectId: Project["id"]) => {
            const project = state.projects.find((project) => {
                return project.id === projectId
            })

            if (!project) throw new Error("No project found")

            return project.quote?.amountPaid
        },

        totalCost: (state) => (projectId: Project["id"]) => {
            const project = state.projects.find((project) => {
                return project.id === projectId
            })

            if (!project) throw new Error("No project found")

            return project.quote?.totalAmount
        },

        quote: (state) => (projectId: Project["id"]) => {
            const project = state.projects.find((project) => {
                return project.id === projectId
            })

            if (!project) throw new Error("project not found")

            return project.quote
        },

        getProjectById:
            (state) =>
            (id: string): Project | undefined => {
                const project = state.projects.find((project) => {
                    return project.id === id
                })

                return project
            },

        getNextProjectPhase: (state) => (phase: ProjectPhase) => {
            const index = projectPhases.indexOf(phase)
            return projectPhases[index + 1] as ProjectPhase
        },

        getIds(state) {
            return state.projects.map((project) => {
                return project.id
            })
        },
    },

    actions: {
        async init() {
            if (!import.meta.client) return

            const $db = useDb()
            const colRef = collection($db, "projects")

            onSnapshot(colRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const projectData = change.doc.data()

                    const project = {
                        id: change.doc.id,
                        ...projectData,
                    } as Project

                    if (change.type === "added") {
                        const index = this.projects.findIndex((p) => p.id === project.id)
                        if (index === -1) {
                            this.projects.push(project)
                        }
                        return
                    }

                    if (change.type === "modified") {
                        const index = this.projects.findIndex((p) => p.id === project.id)

                        if (index === -1) {
                            return
                        }

                        this.projects[index] = project

                        return
                    }

                    if (change.type === "removed") {
                        // Remove deleted projects from the state
                        this.projects = this.projects.filter((project) => project.id !== change.doc.id)
                    }
                })
            })
        },

        async changePhaseOnPayment(projectId: Project["id"]) {
            const project = this.getProjectById(projectId)

            if (!project?.quote) throw new Error("No quote")
            // Move to design phase on 33% payment
            if (project.phase === "discovery") {
                if (project.quote.amountPaid >= project.quote.totalAmount * 0.32) {
                    await this.incrementPhase(projectId)
                }

                const action: Action = {
                    id: uuid(),
                    description: "Book the initial design meeting",
                    timestamp: Date.now(),
                    status: "pending",
                    action: "book-meeting",
                }

                $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Thank you for choosing us! Please book the initial design meeting at your convenience.",
                    [action.id]
                )

                createObject<Action>(`/projects/${projectId}/user-required-actions`, action)

                return
            }

            // Move to development phase on 66% payment
            if (project.phase === "design") {
                if (project.quote.amountPaid > project.quote.totalAmount * 0.65) {
                    await this.incrementPhase(projectId)
                }

                return
            }

            // await 100% payment before moving website onto clients URL
            if (project.phase === "launch") {
                if (project.quote.amountPaid >= project.quote.totalAmount) {
                    await this.incrementPhase(projectId)
                }

                return
            }
        },

        async create(project: Omit<Project, "id">) {
            try {
                const projectId = await createObject<Omit<Project, "id">>("/projects", project)
                const action: Action = {
                    id: uuid(),
                    timestamp: Date.now(),
                    status: "pending",
                    action: "book-meeting",
                    description: "Please book a design meeting",
                }

                await createObject(`/projects/${projectId}/user-required-actions`, action)

                await $ActivityLogs.addPhaseActivityItem(projectId, "discovery")
                await $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Welcome to our new project! To kick things off, book the discovery meeting.",
                    [action.id]
                )
            } catch (error) {
                console.error(error)
            }
        },

        async updatePhase(projectId: string, phase: ProjectPhase) {
            try {
                await updateObject(`/projects/${projectId}`, { phase })

                $ActivityLogs.addPhaseActivityItem(projectId, phase)
            } catch (error) {
                console.error(error)
            }
        },

        async meetingScheduled(projectId: Project["id"], meetingUrl: string, clientUrl: string) {
            const meeting = await this.getCalendlyMeetingDetails(projectId, meetingUrl, clientUrl)

            try {
                await createObject<Meeting>(`/projects/${projectId}/meetings`, meeting)

                // await updateObject(`/projects/${projectId}`, { meeting })
                await updateObject(`/projects/${projectId}`, { action: "none" })

                $ActivityLogs.addMeetingActivityItem(projectId, meeting.id)
            } catch (error) {
                console.error(error)
            }
        },

        async getCalendlyMeetingDetails(
            projectId: Project["id"],
            meetingUrl: string,
            clientUrl: string
        ): Promise<Meeting> {
            const config = useRuntimeConfig()

            const meetingDetails = await axios.get(meetingUrl, {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${config.public.CALENDLY_PAT}`,
                },
            })

            const clientDetailsResponse = await axios.get(clientUrl, {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${config.public.CALENDLY_PAT}`,
                },
            })

            const calendlyMeeting = meetingDetails.data
            const clientDetails = clientDetailsResponse.data

            const meeting: Meeting = Object.assign(
                {},
                {
                    id: uuid(),
                    projectId: projectId,
                    timestamp: Date.now(),
                    name: calendlyMeeting.resource.name as string,
                    startTime: new Date(calendlyMeeting.resource.start_time).getTime(),
                    meetingUrl: calendlyMeeting.resource.location.join_url as string,
                    cancelUrl: clientDetails.resource.cancel_url as string,
                    rescheduleUrl: clientDetails.resource.reschedule_url as string,
                    status: "scheduled" as MeetingStatus,

                    clients: [
                        {
                            name: clientDetails.resource.name as string,
                            email: clientDetails.resource.email as string,
                        },
                    ],
                }
            )

            return meeting
        },

        async updateAmountPaid(projectId: string, amountPaid: number) {
            await $fetch("/api/projects/update-amount-paid", {
                method: "PUT",
                body: { id: projectId, amountPaid },
            })
        },

        async incrementPhase(projectId: string) {
            const nextPhase = this.getNextProjectPhase(this.getPhaseById(projectId))

            await this.updatePhase(projectId, nextPhase)

            switch (nextPhase) {
                case "live":
                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Your website is now live! View the website at your custom domain."
                    )
                    break

                case "design":
                    const action: Action = {
                        id: uuid(),
                        action: "book-meeting",
                        status: "pending",
                        timestamp: Date.now(),
                        description: "Please schedule a design meeting.",
                    }

                    await createObject<Action>(`/projects/${projectId}/user-actions`, action)
                    break

                case "development":
                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Great, were glad your happy with the design. Now we will get our heads down and build out your vision. Check back for updates on how were doing."
                    )

                    break

                case "launch":
                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Were ready to show you what we have built. Everything has been thouroughly tested and is ready to go. Be sure to book a call so we can hand show you around!"
                    )

                    const quote = this.quote(projectId)
                    if (!quote) throw new Error("No quote")

                    const amountPaid = quote.amountPaid

                    if (amountPaid >= quote.totalAmount) return

                    const paymentAction: Action = {
                        id: uuid(),
                        action: "payment",
                        status: "pending",
                        timestamp: Date.now(),
                        description: "Please make the final payment.",
                    }

                    await createObject<Action>(`/projects/${projectId}/user-required-actions`, paymentAction)

                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Once the final payment is done we will put the website onto your custom domain.",
                        [paymentAction.id]
                    )

                    break

                default:
                    return
            }
        },

        async clientAcceptsDesign(projectId: Project["id"]) {
            const update = {
                design: {
                    accepted: true,
                },
            }

            const amountPaid = this.amountPaid(projectId)
            const totalCost = this.totalCost(projectId)

            if (!amountPaid || !totalCost) throw new Error("No project found")

            await updateObject<Project>(`/projects/${projectId}`, update)

            if (amountPaid <= totalCost * 0.65) {
                const action: Action = {
                    id: uuid(),
                    action: "payment",
                    description: "Please make a payment to continue.",
                    timestamp: Date.now(),
                    status: "pending",
                }

                createObject(`/projects/${projectId}/user-required-actions`, action)

                await $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Before moving to the development phase we ask that you pay the 2nd third of the payment.",
                    [action.id]
                )
            } else {
                await this.incrementPhase(projectId)
            }
        },

        async addDesignDocument(projectId: Project["id"], figmaLink: string) {
            const update = {
                design: {
                    url: figmaLink,
                    accepted: false,
                },
            }

            await updateObject<Project>(`/projects/${projectId}`, update)

            $ActivityLogs.addMessageActivityItem(projectId, "has uploaded the design document.", "codypwakeford.com")

            const action: Action = {
                id: uuid(),
                action: "accept-design",
                description: "Accept the design docuement to move to the development phase",
                timestamp: Date.now(),
                status: "pending",
            }

            createObject<Action>(`/projects/${projectId}/user-required-actions`, action)

            $ActivityLogs.addSystemMessageActivityItem(
                projectId,
                "When your 100% happy with the design, you accept it in the action menu. This will move the project into the development phase. Beware, once the website is in development no changes may be made.",
                [action.id]
            )
        },

        // async requestMeeting(projectId: string) {

        //     await createObject<Action>(`/projects/${projectId}/user-required-actions`, {
        //         type: "meeting",
        //         message: "Please book a meeting.",
        //     })
        // },

        async acceptProjectProposal(projectId: Project["id"]) {
            const quote = this.getProjectById(projectId)?.quote
            if (!quote) throw new Error("Quote not found")

            try {
                const update = {
                    quote: { accepted: true },
                }

                await updateObject(`/projects/${projectId}`, update)

                $ActivityLogs.addMessageActivityItem(projectId, "Project proposal has been accepted.", $User.email)

                if (quote && quote.amountPaid < quote.totalAmount / 3) {
                    const action: Action = {
                        id: uuid(),
                        action: "payment",
                        status: "pending",
                        timestamp: Date.now(),
                        description: "Please make a payment to continue.",
                    }

                    createObject(`/projects/${projectId}/user-required-actions`, action)

                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "To progress to the design phase you need to pay a minimum of 1 third of the quote cost.",
                        [action.id]
                    )
                }
            } catch (error) {
                console.error(error)
            }
        },

        /**A testing function */
        async createDummy() {
            this.create(DummyProject)
        },
    },
})

const DummyProject: Omit<Project, "id"> = {
    name: "Test Project",
    emails: ["codypwakeford@gmail.com"],
    phase: "discovery",
    design: {
        accepted: false,
    },
    domain: "codywakeford.com",
}

/**List of project phases in order for reference. */
const projectPhases: ProjectPhase[] = ["discovery", "design", "development", "testing", "launch", "live"]
