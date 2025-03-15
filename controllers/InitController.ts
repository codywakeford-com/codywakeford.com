import type { Unsubscribe } from "firebase/auth"
import { orderBy, where } from "firebase/firestore"
import DbService from "~~/services/DbService"
import ProjectService from "~~/services/ProjectService"

export default class InitController {
    // Set up the users dashboard listeners.
    static async initProjectListeners(email: string) {
        const $Projects = useProjectStore()
        const $Actions = useActionStore()
        const $ActivityLogs = useActivityLogStore()
        const $Meetings = useMeetingStore()
        const $Files = useFileStore()
        const $app = useAppStore()

        const usub1 = DbService.initCollectionListener(
            `/projects`,
            $Projects.state.projects,
            where("emails", "array-contains", email),
        )

        const projectIds = (await ProjectService.getProjectIdsForUser(email)) || []

        let unsubscribes: Unsubscribe[] = [usub1]
        for (let id of projectIds) {
            const unsubs = [
                DbService.initCollectionListener(`/projects/${id}/user-required-actions`, $Actions.state.actions),
                DbService.initCollectionListener(`/projects/${id}/activity-log`, $ActivityLogs.state.log),
                DbService.initCollectionListener(`/projects/${id}/messages`, $ActivityLogs.state.log),
                DbService.initCollectionListener(
                    `/projects/${id}/meetings`,
                    $Meetings.state.meetings,
                    orderBy("startTime"),
                ),
                DbService.initCollectionListener(`/projects/${id}/files`, $Files.state.files),
            ]
            unsubscribes = [...unsubscribes, ...unsubs]
        }

        for (let unsub of unsubscribes) {
            $app.state.userListeners.push(unsub)
        }
    }

    static async initUserListeners(userId: string) {
        const $User = useUserStore()
        const $app = useAppStore()

        const unsubs = [
            DbService.initDocumentListener(`/users/${userId}`, $User.state.user),
            DbService.initCollectionListener(`/users/${userId}/payment-methods`, $User.state.paymentMethods),
        ]

        for (let unsub of unsubs) {
            $app.state.userListeners.push(unsub)
        }
    }
}
