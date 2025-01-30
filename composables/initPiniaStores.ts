// import { useUserStore } from "~/stores/user"
// import { useProjectStore } from "../stores/projects"
// import { useChatroomStore } from "../stores/chatroom"
// import { useNotificationStore } from "../stores/notifications"

export type ProjectStore = ReturnType<typeof useProjectStore>
export type UserStore = ReturnType<typeof useUserStore>
export type ChatroomStore = ReturnType<typeof useChatroomStore>
export type NotificationStore = ReturnType<typeof useNotificationStore>
export type FileStore = ReturnType<typeof useFileStore>
export type ActivityLogStore = ReturnType<typeof useActivityLogStore>
export type AppStore = ReturnType<typeof useAppStore>
export type MeetingStore = ReturnType<typeof useMeetingStore>

let $User: UserStore
let $Chatroom: ChatroomStore
let $Projects: ProjectStore
let $Notifications: NotificationStore
let $Files: FileStore
let $ActivityLogs: ActivityLogStore
let $App: AppStore
let $Meetings: MeetingStore

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

    $Chatroom = useChatroomStore()
    await $Chatroom.init()

    $Meetings = useMeetingStore()
    await $Meetings.init()

    $App.setInitialized(true)
}

export { $User, $Projects, $Chatroom, $Notifications, $Files, $ActivityLogs, $App, $Meetings }
