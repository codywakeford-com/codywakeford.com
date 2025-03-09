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

export async function initPiniaStores() {
    if (!import.meta.client) return

    $User = useUserStore()
    $Projects = useProjectStore()

    if ($User.state.user) {
        InitController.initProjectListeners($User.state.user.email)
    }

    $Actions = useActionStore()
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
    $Files,
    $ActivityLogs,
    $App,
    $Meetings,
    $Actions,
    $BillingModal,
    $Calendly,
}
