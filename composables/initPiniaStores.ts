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

let $User: UserStore
let $Chatroom: ChatroomStore
let $Projects: ProjectStore
let $Notifications: NotificationStore
let $Files: FileStore
let $ActivityLogs: ActivityLogStore

export let piniaInitialized = false

export async function initPiniaStores() {
    if (!import.meta.client) return
    if (piniaInitialized) return

    $User = useUserStore()
    await $User.init()

    console.log("hello pinia")

    $Projects = useProjectStore()
    await $Projects.init()

    $ActivityLogs = useActivityLogStore()
    await $ActivityLogs.init()

    // $Notifications = useNotificationStore()
    // $Notifications.init()

    $Files = useFileStore()
    $Files.init()

    $Chatroom = useChatroomStore()
    $Chatroom.init()

    piniaInitialized = true
    console.log("piniasInitialized")
}

export { $User, $Projects, $Chatroom, $Notifications, $Files, $ActivityLogs }
