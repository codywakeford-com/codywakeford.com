let $User: ReturnType<typeof useUserStore>
let $Chatroom: ReturnType<typeof useChatroomStore>
let $Projects: ReturnType<typeof useProjectStore>
let $Notifications: ReturnType<typeof useNotificationStore>
let $Files: ReturnType<typeof useFileStore>
let $ActivityLogs: ReturnType<typeof useActivityLogStore>
let $App: ReturnType<typeof useAppStore>
let $Meetings: ReturnType<typeof useMeetingStore>
let $Actions: ReturnType<typeof useActionStore>
let $BillingModal: ReturnType<typeof useBillingModalStore>
let $Stripe: ReturnType<typeof useStripeStore>
let $Calendly: ReturnType<typeof useCalendlyStore>

export async function initPiniaStores() {
    if (!import.meta.client) return
    $App = useAppStore()

    if ($App.initialized) return

    $User = useUserStore()
    await $User.init()

    $Projects = useProjectStore()
    await $Projects.init()

    $ActivityLogs = useActivityLogStore()
    await $ActivityLogs.init()

    $Files = useFileStore()
    await $Files.init()

    $Actions = useActionStore()
    $Actions.init()

    $Stripe = useStripeStore()
    $Calendly = useCalendlyStore()

    $Chatroom = useChatroomStore()
    await $Chatroom.init()

    $Meetings = useMeetingStore()
    await $Meetings.init()

    $BillingModal = useBillingModalStore()

    $App.setInitialized(true)
}

export { $User, $Projects, $Chatroom, $Notifications, $Files, $ActivityLogs, $App, $Meetings, $Actions, $BillingModal, $Stripe, $Calendly }
