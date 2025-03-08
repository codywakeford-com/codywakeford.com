import DbService from "./DbService"

export default class ActionService {
    static async createUserAction(projectId: string, actionType: Action["action"], description: string) {
        const action: Action = {
            id: uuid(),
            priority: actionType === "payment" ? 10 : 1,
            timestamp: Date.now(),
            status: "pending",
            action: actionType,
            description: description,
            projectId,
        }

        await DbService.createObject<Action>(`/projects/${projectId}/user-required-actions`, action)
    }

    static async onAction(projectId: string, actionType: Action["action"]) {
        const actions = $Actions.getPendingByProjectId(projectId)

        if (actions.length === 0) {
            return
        }

        const action = actions.find((a) => a.action === actionType)

        if (!action) {
            return
        }

        await ActionService.markActionAsComplete(projectId, action.id)
    }

    static async markActionAsComplete(projectId: string, actionId: string) {
        const update: Partial<Action> = { status: "completed" }
        await DbService.updateObject<Action>(`/projects/${projectId}/user-required-actions/${actionId}`, update)
    }
}
