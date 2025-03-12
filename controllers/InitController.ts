import { orderBy, where } from "firebase/firestore"
import DbService from "~~/services/DbService"
import ProjectService from "~~/services/ProjectService"

export default class InitController {
    // Set up the users dashboard listeners.
    static async initProjectListeners(email: string) {
        DbService.initCollectionListener(
            `/projects`,
            $Projects.state.projects,
            where("emails", "array-contains", email),
        )

        const projectIds = (await ProjectService.getProjectIdsForUser(email)) || []
        for (let id of projectIds) {
            DbService.initCollectionListener(`/projects/${id}/user-required-actions`, $Actions.state.actions)
            DbService.initCollectionListener(`/projects/${id}/activity-log`, $ActivityLogs.state.log)
            DbService.initCollectionListener(`/projects/${id}/messages`, $ActivityLogs.state.log)
            DbService.initCollectionListener(`/projects/${id}/meetings`, $Meetings.state.meetings, orderBy("startTime"))
            DbService.initCollectionListener(`/projects/${id}/files`, $Files.state.files)
        }
    }

    static async initUserListeners(userId: string) {
        DbService.initDocumentListener(`/users/${userId}`, $User.state.user)
        DbService.initCollectionListener(`/users/${userId}/payment-methods`, $User.state.paymentMethods)
    }
}
