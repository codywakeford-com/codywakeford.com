import { collection, doc, Firestore, onSnapshot } from "firebase/firestore"
import { defineStore } from "pinia"

export const useChatroomStore = defineStore("chatrooms", {
    state: () => ({
        chatrooms: [] as Chatroom[],
    }),

    getters: {
        get(state) {
            return state.chatrooms
        },

        getChatroomMessages: (state) => (chatroomId: string) => {
            const chatroom = state.chatrooms.find((chatroom) => {
                return chatroom.projectId === chatroomId
            })

            return chatroom ? chatroom.messages : []
        },

        getChatroomNames(state) {
            return state.chatrooms.map((chatroom) => {
                return chatroom.projectId
            })
        },
    },

    actions: {
        async init() {
            this.readChatrooms()

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

                    const chatroom = this.chatrooms.find((chatroom) => chatroom.projectId === projectId)

                    if (chatroom) {
                        const latestLocalMessageTime = Number(chatroom.messages.at(-1)?.timestamp) || 0

                        const newMessages = messages.filter(
                            (message) => Number(message.timestamp) > latestLocalMessageTime
                        )

                        chatroom.messages.push(...newMessages)
                    }
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
        },

        async readChatrooms() {
            const chatroomIds = await $fetch("/api/projects/ids")
            if (!chatroomIds) return []

            let chatrooms = [] as Chatroom[]

            for (let id of chatroomIds) {
                let chatroom = {
                    projectId: id,
                    messages: [] as Message[],
                } as Chatroom

                const messages = await this.readChatroomMessages(id)
                chatroom.messages = messages
                chatrooms.push(chatroom)
            }

            chatrooms.forEach((room) => {
                room.messages.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
            })

            this.chatrooms = chatrooms
        },

        async readChatroomMessages(projectId: string) {
            const response = await $fetch<Message[]>(`/api/chatrooms/messages/${projectId}`)
            return response || []
        },

        async sendMessage(projectId: string, message: Omit<Message, "id" | "timestamp">) {
            const chatroom = this.chatrooms.find((chatroom) => {
                return chatroom.projectId === projectId
            })

            if (!chatroom) {
                throw new Error("Chatroom not found")
            }

            const optimisticMessage: Message = {
                ...message,
                id: `temp-${Date.now()}`,
                timestamp: Date.now(),
            }

            chatroom.messages.push(optimisticMessage)

            try {
                await createObject<Omit<Message, "id" | "timestamp">>(`/projects/${projectId}/messages`, message)
            } catch (error) {
                console.error(error)
                chatroom.messages.pop()
            }
        },
    },
})
