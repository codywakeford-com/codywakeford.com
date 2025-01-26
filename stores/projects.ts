import axios from "axios"
import { collection, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"
import { velorisStaffEmails } from "./notifications"

export const useProjectStore = defineStore("projects", {
    state: () => ({
        projects: [] as Project[],
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

            return project.quote?.totalAmount
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
        getProjectById: (state) => (id: string) => {
            return state.projects.find((project) => {
                return project.id === id
            })
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
            await useFetch("/api/projects", {
                method: "put",
                body: {
                    id: projectId,
                    key: "quote",
                    value: quote,
                },
            })

            const docs: Omit<ProjectFile, "id">[] = [
                {
                    name: "Project Proposal",
                    url: quote.proposalUrl,
                    extension: "pdf",
                    signed: false,
                    type: "document",
                    timestamp: Date.now(),
                    sender: "codypwakeford@gmail.com",
                },
                {
                    name: "Project Quote",
                    url: quote.quoteUrl,
                    extension: "pdf",
                    signed: false,
                    timestamp: Date.now(),
                    type: "document",
                    sender: "codypwakeford@gmail.com",
                },
            ]

            docs.forEach((doc) => this.addProjectDocument(projectId, doc))

            $Files.addFileToProject(projectId, docs[0])
            $Files.addFileToProject(projectId, docs[1])

            $ActivityLogs.addQuoteActivityItem(projectId)
        },

        async addProjectDocument(projectId: string, document: Omit<ProjectFile, "id">) {
            await useFetch("/api/projects/document", {
                method: "POST",
                body: { id: projectId, document },
            })
        },

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
            $ActivityLogs.addPhaseActivityItem(projectId, nextPhase)
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

            // Notify all clients on project.
            // $Notifications.create({
            //     message: "",
            //     mode: "success",
            //     title: "You have been requested for a meeting.",
            //     to: project.emails,
            //     action: {
            //         type: "link",
            //         url: `/admin/clients/${projectId}`,
            //     },
            //     type: "project",
            // })
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
                        "payment"
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
    action: "meeting",
    paymentPlan: "noneSelected",
    companyName: "VelorisDesigns",
    domain: "codywakeford.com",
    description: "Website design and developement.",
}

const dummyQuote: ProjectQuote = {
    totalAmount: 1000,
    quoteUrl:
        "https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/ftPzCrLExM23hJSFGmvu%2Ffiles%2Fcv%20(1).pdf?alt=media&token=cb0590a8-0b18-4baa-aaf9-f0665651a1fa",
    proposalUrl:
        "https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/ftPzCrLExM23hJSFGmvu%2Ffiles%2Fcv%20(1).pdf?alt=media&token=cb0590a8-0b18-4baa-aaf9-f0665651a1fa",
    items: [],
    amountPaid: 0,
}

/**List of project phases in order for reference. */
const projectPhases: ProjectPhase[] = ["discovery", "design", "development", "final-approval", "testing", "launch"]
