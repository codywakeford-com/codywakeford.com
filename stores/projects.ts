import axios from "axios"
import { collection, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

export const useProjectStore = defineStore("projects", {
    state: () => ({
        projects: [] as Project[],
        selectedProjectId: "",
        quoteUrl: null as ProjectFile["url"] | null,
        proposalUrl: null as ProjectFile["url"] | null,
        total: null as number | null,
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
                        this.projects = this.projects.filter((project) => project.id !== change.doc.id)
                    }
                })
            })
        },

        async create(project: Omit<Project, "id">) {
            try {
                const projectId = await createObject<Omit<Project, "id">>("/projects", project)
                const action: Action = {
                    id: uuid(),
                    priority: 1,
                    timestamp: Date.now(),
                    status: "pending",
                    action: "book-meeting",
                    description:
                        "Welcome to our project. We're glad to have you on board. To kick things of book your discovery meeting using the button below. This helps us define the project outline and allows us to generate you a quote. See you soon! ",
                    projectId,
                }

                await createObject(`/projects/${projectId}/user-required-actions`, action)

                await $ActivityLogs.addPhaseActivityItem(projectId, "discovery")
                await $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Welcome to our new project! To kick things off, book the discovery meeting. You can find action buttons at top right of this dashboard.",
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

        async getCalendlyMeetingDetails(projectId: Project["id"], meetingUrl: string, clientUrl: string): Promise<Meeting> {
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
            const project = this.getProjectById(projectId)

            if (!project || !project.quote) throw new Error("Invalid State")

            const quote = project.quote
            const amountPaidDecimal = quote.amountPaid / quote.totalAmount

            switch (project.phase) {
                case "discovery":
                    if (amountPaidDecimal < 0.33) {
                        const paymentAction: Action = {
                            id: uuid(),
                            timestamp: Date.now(),
                            projectId,
                            description: "  ",
                            priority: 1000,
                            action: "payment",
                            status: "pending",
                        }

                        await createObject(`/projects/${projectId}/user-required-actions`, paymentAction)
                        return
                    }

                    const action: Action = {
                        id: uuid(),
                        action: "book-meeting",
                        priority: 1,
                        status: "pending",
                        timestamp: Date.now(),
                        description:
                            "Welcome to our project. We're glad to have you on board. To kick things of book your design meeting using the button below. Here we will gather all the infomation we need to generate the structure of the website, and from that we can build out the design in your vision.",
                        projectId,
                    }

                    await createObject<Action>(`/projects/${projectId}/user-required-actions`, action)
                    break

                case "design":
                    if (amountPaidDecimal < 0.66) {
                        const action: Action = {
                            id: uuid(),
                            timestamp: Date.now(),
                            projectId,
                            description:
                                "Great, were glad your happy with the design, not long to go now. Next we bring it to life! To move foward to the development stage plase pay up to a minimum of 66% of the project quote. ",
                            priority: 1000,
                            action: "payment",
                            status: "pending",
                        }

                        await createObject(`/projects/${projectId}/user-required-actions`, action)
                        await $ActivityLogs.addSystemMessageActivityItem(
                            projectId,
                            "Before moving to the development phase I ask you make the second payment. A minimum of 66% of the project quote should be paid before moving forward."
                        )

                        return
                    }

                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Great, were glad your happy with the design. Now we will get our heads down and build out your vision. Check back for updates on how were doing."
                    )

                    break
                case "development":
                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "I have done the majority of the work now. Everything has been built, now I just need to go through and thouroughly test everything. I'll make sure the website is accessable on every device and make sure the code is secure."
                    )
                    break

                case "testing":
                    const meetingAction: Action = {
                        id: uuid(),
                        priority: 10,
                        action: "book-meeting",
                        status: "pending",
                        timestamp: Date.now(),
                        description:
                            "The website has been built out, we have run all of our tests on it and it works seemlessly on all devices. I'm ready to show you what we have done. Book a meeting so I can show your new website!",
                        projectId,
                    }

                    await createObject(`/projects/${projectId}/user-required-actions`, meetingAction)

                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "I'm ready to show you what I've have built. Everything has been thouroughly tested and is ready to go. Be sure to book a call so I can show you around!"
                    )

                    break

                case "launch":
                    if (amountPaidDecimal < 1) {
                        const paymentAction: Action = {
                            id: uuid(),
                            priority: 10,
                            action: "payment",
                            status: "pending",
                            timestamp: Date.now(),
                            description:
                                "Just before we put the website onto your live public domain we ask you make the final payment. After that your webiste will be up and running within a few hours!",
                            projectId,
                        }

                        await createObject<Action>(`/projects/${projectId}/user-required-actions`, paymentAction)

                        $ActivityLogs.addSystemMessageActivityItem(
                            projectId,
                            "Please pay the remaining balance on the project so we can launch your new website!",
                            [paymentAction.id]
                        )

                        return
                    }
                    $ActivityLogs.addSystemMessageActivityItem(projectId, "Your website is now live! View the website at your custom domain.")
                    break

                default:
                    break
            }

            await this.updatePhase(projectId, this.getNextProjectPhase(project.phase))
        },
        async addQuoteToProject(projectId: Project["id"]) {
            if (!this.proposalUrl || !this.quoteUrl || !this.total) return
            const files: Omit<ProjectFile, "id">[] = [
                {
                    name: "ProjectProposal",
                    projectId: projectId,
                    extension: "pdf",
                    sender: "codypwakeford@gmail.com",
                    size: 15,
                    timestamp: Date.now(),
                    url: this.proposalUrl,
                    type: "document",
                },
                {
                    name: "ProjectQuote",
                    projectId: projectId,
                    extension: "pdf",
                    sender: "codypwakeford@gmail.com",
                    timestamp: Date.now(),
                    size: 15,
                    url: this.quoteUrl,
                    type: "document",
                },
            ]

            const newFiles: ProjectFile[] = []

            for (let i = 0; i < files.length; i++) {
                const id = await createObject<Omit<ProjectFile, "id">>(`/projects/${projectId}/files`, files[i])

                if (!id) return

                newFiles.push({
                    id: id,
                    ...files[i],
                })
            }

            const quote: ProjectQuote = {
                amountPaid: 0,
                totalAmount: this.total * 100,
                files: newFiles,
            }

            await updateObject(`/projects/${projectId}`, { quote })
            $ActivityLogs.addQuoteActivityItem(projectId)
            await createObject<Action>(`/projects/${projectId}/user-required-actions`, {
                id: uuid(),
                projectId,
                action: "accept-quote",
                timestamp: Date.now(),
                priority: 10,
                description:
                    "Now that we've had our discovery call, I've prepared a quote for you. You can accept it, message me with any questions, or book a call if you'd like to discuss any changes.",
                status: "pending",
            })
        },
        async clientAcceptsDesign(projectId: Project["id"]) {
            const update = {
                design: {
                    accepted: true,
                },
            }
            await updateObject<Project>(`/projects/${projectId}`, update)

            await this.incrementPhase(projectId)
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
                priority: 1,
                action: "accept-design",
                description:
                    "I have uploaded the design document for you to view. The design needs to be finilized before moving to development. Once your happy with the design click the button below to continue. Once the website it being built you will not be able to change the design.",
                timestamp: Date.now(),
                status: "pending",
                projectId,
            }

            createObject<Action>(`/projects/${projectId}/user-required-actions`, action)

            $ActivityLogs.addSystemMessageActivityItem(
                projectId,
                "When your 100% happy with the design, you accept it in the action menu. This will move the project into the development phase. Beware, once the website is in development no changes may be made.",
                [action.id]
            )
        },

        async acceptProjectProposal(projectId: Project["id"], actionId: Action["id"]) {
            const quote = this.getProjectById(projectId)?.quote
            if (!quote) throw new Error("Quote not found")

            try {
                const update = {
                    quote: { accepted: true },
                }

                await updateObject(`/projects/${projectId}`, update)

                $ActivityLogs.addMessageActivityItem(projectId, "has accepted the project proposal.", $User.email)

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

                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "To progress to the design phase you need to pay a minimum of 1 third of the quote cost.",
                        [action.id]
                    )
                }

                $Actions.markAsComplete(actionId)
            } catch (error) {
                console.error(error)
            }
        },

        /**A testing function */
        async createProject(type: Project["type"]) {
            let project: Project = {
                id: uuid(),
                emails: ["codypwakeford@gmail.com"],
                phase: "discovery",
                design: {
                    accepted: false,
                },

                type: "full",
                domain: "codywakeford.com",
            }

            if (type === "build") {
                project.phase = "development"
                project.type = "build"
            }

            this.create(project)
        },
    },
})

const DummyProject: Project = {
    id: uuid(),
    emails: ["codypwakeford@gmail.com"],
    phase: "discovery",
    design: {
        accepted: false,
    },

    type: "full",
    domain: "codywakeford.com",
}

/**List of project phases in order for reference. */
const projectPhases: ProjectPhase[] = ["discovery", "design", "development", "testing", "launch", "live"]
