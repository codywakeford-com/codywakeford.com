import axios from "axios"
import { collection, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"
import { velorisStaffEmails } from "./notifications"

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

        getPhaseById: (state) => (projectId: string) => {
            const projectIndex = state.projects.findIndex((project) => {
                return project.id === projectId
            })

            return state.projects[projectIndex].phase
        },

        meeting: (state) => (projectId: Project["id"]) => {
            const project = state.projects.find((p) => {
                return p.id === projectId
            })

            if (!project) throw new Error("Project not found")

            return project.meeting
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
            (id: string): Project => {
                const project = state.projects.find((project) => {
                    return project.id === id
                })

                // if (!project) throw new Error("project not found")

                return project
            },

        getNextProjectPhase: (state) => (phase: ProjectPhase) => {
            const index = projectPhases.indexOf(phase)
            return projectPhases[index + 1] as ProjectPhase
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

            if (!project.quote) throw new Error("No quote")

            // Move to design phase on 33% payment
            if (project.phase === "discovery") {
                console.log(project.quote.amountPaid)
                console.log(project.quote.totalAmount * 0.32)
                if (project.quote.amountPaid >= project.quote.totalAmount * 0.32) {
                    this.incrementPhase(projectId)
                }

                $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Thank you for choosing us! Please book the initial design meeting at your convenience.",
                    { type: "design-meeting", message: "Book the design meeting" }
                )

                return
            }

            // Move to development phase on 66% payment
            if (project.phase === "design") {
                if (project.quote.amountPaid > project.quote.totalAmount * 0.65) {
                    this.incrementPhase(projectId)
                }

                return
            }

            // await 100% payment before moving website onto clients URL
            if (project.phase === "launch") {
                if (project.quote.amountPaid >= project.quote.totalAmount) {
                    this.incrementPhase(projectId)
                }

                return
            }
        },

        async updateDb(project: Project) {
            try {
                $fetch(`/api/projects/${project.id}`, {
                    method: "PUT",
                    body: { project },
                })
            } catch (error) {
                console.error()
            }
        },

        async read() {
            try {
                const response = await $fetch<Project[]>("/api/projects")
                this.projects = response
            } catch (error) {
                console.error(error)
            }
        },

        async create(project: Omit<Project, "id">) {
            try {
                const projectId = await $fetch<Project["id"]>("/api/projects", {
                    method: "POST",
                    body: { project: project },
                })

                await $ActivityLogs.addPhaseActivityItem(projectId, "discovery")
                await $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Welcome to our new project! To kick things off, book the discovery meeting.",
                    { type: "meeting", message: "Book a call" }
                )
            } catch (error) {
                console.error(error)
            }
        },

        async updatePhase(projectId: string, phase: ProjectPhase) {
            try {
                await $fetch("/api/projects/status", {
                    method: "PUT",
                    body: {
                        id: projectId,
                        phase: phase,
                    },
                })

                $ActivityLogs.addPhaseActivityItem(projectId, phase)
            } catch (error) {
                console.error(error)
            }
        },

        async setPaymentPlan(projectId: string, paymentPlan: Project["paymentPlan"]) {
            try {
                await $fetch("/api/projects", {
                    method: "PUT",
                    body: {
                        id: projectId,
                        key: "paymentPlan",
                        value: paymentPlan,
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },

        async meetingScheduled(projectId: Project["id"], meetingUrl: string, clientUrl: string) {
            const meeting = await this.getCalendlyMeetingDetails(meetingUrl, clientUrl)

            try {
                // Add meeting details to db
                await $fetch("/api/projects", {
                    method: "PUT",
                    body: {
                        id: projectId,
                        key: "meeting",
                        value: meeting,
                    },
                })

                await $fetch("/api/projects", {
                    method: "PUT",
                    body: {
                        id: projectId,
                        key: "action",
                        value: "none",
                    },
                })

                $ActivityLogs.addMeetingActivityItem(projectId, "booked")
            } catch (error) {
                console.error(error)
            }

            // Notify veloris staff
            // $Notifications.create({
            //     message: "",
            //     mode: "success",
            //     title: "A client has booked a meeting.",

            //     to: velorisStaffEmails,
            //     action: {
            //         type: "link",
            //         url: `/admin/clients/${projectId}`,
            //     },
            //     type: "client",
            // })
        },

        async getCalendlyMeetingDetails(meetingUrl: string, clientUrl: string): Promise<Meeting> {
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
                    name: calendlyMeeting.resource.name as string,
                    startTime: calendlyMeeting.resource.start_time as string,
                    meetingUrl: calendlyMeeting.resource.location.join_url as string,
                    cancelUrl: clientDetails.resource.cancel_url as string,
                    rescheduleUrl: clientDetails.resource.reschedule_url as string,

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

        async uploadQuote(projectId: string, quote: ProjectQuote) {
            await updateObject(`/projects/${projectId}`, quote)

            const docs: Omit<ProjectFile, "id">[] = [
                {
                    name: "Project Proposal",
                    url: quote.proposal,
                    extension: "pdf",
                    signed: false,
                    type: "document",
                    timestamp: Date.now(),
                    sender: "codypwakeford@gmail.com",
                },
                {
                    name: "Project Quote",
                    url: quote.quote,
                    extension: "pdf",
                    signed: false,
                    timestamp: Date.now(),
                    type: "document",
                    sender: "codypwakeford@gmail.com",
                },
            ]

            docs.forEach((doc) => {
                createObject<ProjectFile>(`/projects/${projectId}/files`, doc)
            })

            $Files.addFileToProject(projectId, docs[0])
            $Files.addFileToProject(projectId, docs[1])

            $ActivityLogs.addQuoteActivityItem(projectId)
        },

        // async addProjectDocument(projectId: string, document: Omit<ProjectFile, "id">) {
        //     await useFetch("/api/projects/document", {
        //         method: "POST",
        //         body: { id: projectId, document },
        //     })
        // },

        async updateAmountPaid(projectId: string, amountPaid: number) {
            await $fetch("/api/projects/update-amount-paid", {
                method: "PUT",
                body: { id: projectId, amountPaid },
            })
        },

        async addDummyQuote(projectId: Project["id"]) {
            this.uploadQuote(projectId, dummyQuote)
        },

        async incrementPhase(projectId: string) {
            const nextPhase = this.getNextProjectPhase(this.getPhaseById(projectId))

            this.updatePhase(projectId, nextPhase)

            switch (nextPhase) {
                case "live":
                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Your website is now live! View the website at your custom domain.",
                        { type: "none" }
                    )
                    break

                case "design":
                    await createObject<Action>(`/projects/${projectId}/user-actions`, {
                        type: "meeting",
                        message: "Please book a design meeting",
                    })
                    break

                case "development":
                    await $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "Great, were glad your happy with the design. Now we will get our heads down and build out your vision. Check back for updates on how were doing.",
                        { type: "none" }
                    )

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

            console.log(amountPaid)
            console.log(totalCost * 0.65)

            await updateObject<Project>(`/projects/${projectId}`, update)

            if (amountPaid <= totalCost * 0.65) {
                await $ActivityLogs.addSystemMessageActivityItem(
                    projectId,
                    "Before moving to the development phase we ask that you pay the 2nd third of the payment.",
                    { type: "payment" }
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
            $ActivityLogs.addSystemMessageActivityItem(
                projectId,
                "When your 100% happy with the design, you accept it in the action menu. This will move the project into the development phase. Beware, once the website is in development no changes may be made.",
                { type: "accept-design", message: "Accept design document." }
            )
        },

        async requestMeeting(projectId: string) {
            const project = this.getProjectById(projectId)

            await useFetch("/api/projects", {
                method: "put",
                body: {
                    id: projectId,
                    key: "action",
                    value: "meeting",
                },
            })

            if (!project) throw new Error("No project found")
        },

        async delete(id: string) {
            await useFetch(`/api/projects/${id}`, {
                method: "delete",
            })
        },

        async acceptProjectProposal(projectId: Project["id"]) {
            const quote = this.getProjectById(projectId)?.quote
            if (!quote) throw new Error("Quote not found")

            quote.accepted = true

            try {
                await $fetch("/api/projects", {
                    method: "PUT",
                    body: {
                        id: projectId,
                        key: "quote",
                        value: quote,
                    },
                })
                $ActivityLogs.addMessageActivityItem(projectId, "Project proposal has been accepted.", $User.email)

                if (quote && quote.amountPaid < quote.totalAmount / 3) {
                    $ActivityLogs.addSystemMessageActivityItem(
                        projectId,
                        "To progress to the design phase you need to pay a minimum of 1 third of the quote cost.",
                        { type: "payment" }
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
    action: [
        {
            type: "meeting",
            message: "Please book our discovery meeting.",
        },
    ],
    domain: "codywakeford.com",
}

const dummyQuote: ProjectQuote = {
    totalAmount: 1000,
    quote: "https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/ftPzCrLExM23hJSFGmvu%2Ffiles%2Fcv%20(1).pdf?alt=media&token=cb0590a8-0b18-4baa-aaf9-f0665651a1fa",
    proposal:
        "https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/ftPzCrLExM23hJSFGmvu%2Ffiles%2Fcv%20(1).pdf?alt=media&token=cb0590a8-0b18-4baa-aaf9-f0665651a1fa",
    amountPaid: 0,
}

/**List of project phases in order for reference. */
const projectPhases: ProjectPhase[] = ["discovery", "design", "development", "testing", "launch", "live"]
