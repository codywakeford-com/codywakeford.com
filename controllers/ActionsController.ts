// We can use this class whenever an event is fired.
// The controller will check to see if the user completed and existing action.

import ActionService from "~~/services/ActionService"

export default class ActionController {
    static async onPayment(projectId: string) {
        await ActionService.onAction(projectId, "payment")
    }

    static async onAccept(projectId: string) {
        await ActionService.onAction(projectId, "accept-quote")
    }

    static async onAcceptDesign(projectId: string) {
        await ActionService.onAction(projectId, "accept-design")
    }

    static async onBookCall(projectId: string) {
        await ActionService.onAction(projectId, "book-meeting")
    }
}
