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

    static async markActionAsComplete(projectId: string, actionId: string) {
        const update: Partial<Action> = { status: "completed" }
        await DbService.updateObject<Action>(`/projects/${projectId}/user-required-actions/${actionId}`, update)
    }
}
