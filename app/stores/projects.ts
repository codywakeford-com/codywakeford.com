import { collection, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

interface State {
    projects: Project[]
    selectedProjectId: string
    quoteUrl: null | string
    proposalUrl: null | string
    total: null | number
}

export const useProjectStore = defineStore(
    "projects",
    () => {
        const state: Ref<State> = ref({
            projects: [],
            selectedProjectId: "",
            quoteUrl: null,
            proposalUrl: null,
            total: null,
        })

        const projects = computed(() => state.value.projects)

        const getByEmail = (email: string) => computed(() => state.value.projects.filter((project) => project.emails.includes(email)))

        const designUrl = (projectId: Project["id"]) => computed(() => state.value.projects.find((p) => p.id === projectId)?.design?.url)

        const getPhaseById = (projectId: string) => computed(() => state.value.projects.find((p) => p.id === projectId)?.phase)

        const amountPaid = (projectId: Project["id"]) =>
            computed(() => {
                const project = state.value.projects.find((p) => p.id === projectId)
                if (!project) throw new Error("No project found")
                return project.quote?.amountPaid
            })

        const totalCost = (projectId: Project["id"]) =>
            computed(() => {
                const project = state.value.projects.find((p) => p.id === projectId)
                if (!project) throw new Error("No project found")
                return project.quote?.totalAmount
            })

        const quote = (projectId: Project["id"]) =>
            computed(() => {
                const project = state.value.projects.find((p) => p.id === projectId)
                if (!project) throw new Error("Project not found")
                return project.quote
            })

        const getProjectById = (id: string) => computed(() => state.value.projects.find((p) => p.id === id))

        const getNextProjectPhase = (phase: ProjectPhase) =>
            computed(() => {
                const index = projectPhases.indexOf(phase)
                return projectPhases[index + 1] as ProjectPhase
            })

        const getIds = computed(() => state.value.projects.map((p) => p.id))

        return { state, projects, getByEmail, designUrl, getPhaseById, amountPaid, totalCost, quote, getProjectById, getNextProjectPhase, getIds }
    },
    { persist: true },
)

/**List of project phases in order for reference. */
const projectPhases: ProjectPhase[] = ["discovery", "design", "development", "testing", "launch", "live"]
