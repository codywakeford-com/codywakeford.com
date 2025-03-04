import { collection, doc, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

interface State {
    chatrooms: Chatroom[]
}

export const useChatroomStore = defineStore("chatrooms", () => {
    const state = ref<State>({
        chatrooms: [],
    })

    const chatrooms = computed(() => state.value.chatrooms)

    const chatroomMessages = (chatroomId: string) => {
        return computed(() => {
            const chatroom = state.value.chatrooms.find((chatroom) => chatroom.projectId === chatroomId)
            return chatroom ? chatroom.messages : []
        })
    }

    const chatroomById = (chatroomId: string) => {
        return computed(() => {
            return state.value.chatrooms.find((chatroom) => chatroom.projectId === chatroomId)
        })
    }

    const chatroomNames = computed(() => state.value.chatrooms.map((chatroom) => chatroom.projectId))

    async function init() {
        await readChatrooms()

        const nuxtApp = useNuxtApp()
        const $db = nuxtApp.$db as Firestore

        const projectsRef = collection($db, "projects")

        const listenToMessagesAndDocuments = (projectId: string) => {
            const messagesRef = collection(doc($db, "projects", projectId), "messages")

            onSnapshot(messagesRef, (snapshot) => {
                const messages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Message[]

                const chatroom = chatroomById(projectId).value

                if (!chatroom) return

                const latestLocalMessageTime = Number(chatroom.messages.at(-1)?.timestamp) || 0
                const newMessages = messages.filter((message) => Number(message.timestamp) > latestLocalMessageTime)
                chatroom.messages.push(...newMessages)
            })
        }

        onSnapshot(projectsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const projectId = change.doc.id
                    listenToMessagesAndDocuments(projectId)
                }
            })
        })
    }

    async function readChatrooms() {
        const projectIds = await $fetch<string[]>(`/api/projects/${$User.email}`)

        let chatrooms = [] as Chatroom[]

        for (let projectId of projectIds) {
            let chatroom: Chatroom = {
                projectId: projectId,
                messages: [] as Message[],
            }

            const messages = await readArray<Message>(`/projects/${projectId}/messages`)
            chatroom.messages = messages
            chatrooms.push(chatroom)
        }

        chatrooms.forEach((room) => {
            room.messages.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        })

        state.value.chatrooms = chatrooms
    }

    async function sendMessage(projectId: string, message: Omit<Message, "id" | "timestamp">) {
        const chatroom = chatroomById(projectId).value

        if (!chatroom) throw new Error("Chatroom not found")

        const optimisticMessage: Message = {
            ...message,
            id: uuid(),
            type: "message",
            timestamp: Date.now(),
        }

        chatroom.messages.push(optimisticMessage)

        try {
            await createObject<Message>(`/projects/${projectId}/messages`, optimisticMessage)
        } catch (error) {
            console.error(error)
            chatroom.messages.pop()
        }
    }

    return {
        sendMessage,
        readChatrooms,
        init,
        chatroomNames,
        chatrooms,
        chatroomMessages,
        chatroomById,
    }
})
