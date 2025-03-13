import type { useEmbedModalStore } from "~/stores/embed-modal"
import InitController from "~~/controllers/InitController"

let $User: ReturnType<typeof useUserStore>
let $Chatroom: ReturnType<typeof useChatroomStore>
let $Projects: ReturnType<typeof useProjectStore>
let $Files: ReturnType<typeof useFileStore>
let $ActivityLogs: ReturnType<typeof useActivityLogStore>
let $App: ReturnType<typeof useAppStore>
let $Meetings: ReturnType<typeof useMeetingStore>
let $Actions: ReturnType<typeof useActionStore>
let $BillingModal: ReturnType<typeof useBillingModalStore>
let $Calendly: ReturnType<typeof useCalendlyStore>
let $FilesDashboard: ReturnType<typeof useFilesDashboardStore>
let $EmbedModal: ReturnType<typeof useEmbedModalStore>

export async function initPiniaStores() {
    if (!import.meta.client) return

    $User = useUserStore()
    $Projects = useProjectStore()

    $Projects.state.projects = []

    if ($User.state.user) {
        InitController.initProjectListeners($User.state.user.email)
        InitController.initUserListeners($User.state.user.id)
    }

    $Actions = useActionStore()
    $EmbedModal = useEmbedModalStore()
    $ActivityLogs = useActivityLogStore()
    $Files = useFileStore()
    $Calendly = useCalendlyStore()
    $FilesDashboard = useFilesDashboardStore()
    $Chatroom = useChatroomStore()
    $Meetings = useMeetingStore()
    $BillingModal = useBillingModalStore()
}

export {
    $User,
    $Projects,
    $Chatroom,
    $FilesDashboard,
    $EmbedModal,
    $Files,
    $ActivityLogs,
    $App,
    $Meetings,
    $Actions,
    $BillingModal,
    $Calendly,
}
