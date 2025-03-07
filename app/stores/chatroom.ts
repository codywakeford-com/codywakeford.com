import { collection, doc, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

interface State {
    chatrooms: Chatroom[]
}

export const useChatroomStore = defineStore(
    "chatrooms",
    () => {
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
            chatroomNames,
            chatrooms,
            chatroomMessages,
            chatroomById,
        }
    },
    { persist: true },
)
