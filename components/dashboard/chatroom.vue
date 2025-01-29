<template>
    <section>
        <div class="chatroom-selection card">
            <div
                class="project-card"
                @click="selectedProjectId = project.id"
                v-for="project of chatrooms"
                :class="{ active: selectedProjectId === project.id }"
            >
                <div class="domain">
                    {{ project.domain }}
                </div>

                <div class="phase">{{ project.phase }}</div>
            </div>
        </div>
        <div class="chatroom card">
            <div class="messages-container" ref="messagesContainer">
                <div class="no-messages" v-if="!messages.length">No messages yet.</div>
                <dashboard-chatroom-message v-for="(message, index) of messages" :key="index" :message="message" />
            </div>

            <div class="input-container">
                <div class="input-box">
                    <div v-if="messageFiles.length" class="message-files">
                        <dashboard-file-card-small
                            @delete="removeFile(file.name)"
                            :delete="true"
                            :download="false"
                            v-for="(file, index) of messageFilesProper"
                            :key="index"
                            :file="file"
                        />
                    </div>

                    <div class="input-wrapper" :class="{ files: messageFiles.length }">
                        <textarea
                            v-model="message"
                            type="text"
                            placeholder="Type a message..."
                            class="message-input"
                            :disabled="sending"
                            @keyup.enter="sendMessage(messageObj, messageFiles)"
                        />
                        <label class="file-input-label">
                            <input type="file" @change="handleFileSelect" class="file-input" :disabled="sending" />
                            <Icon icon="gravity-ui:paperclip" width="20" />
                        </label>
                    </div>
                </div>
                <button
                    type="button"
                    class="send-button"
                    :disabled="sending"
                    @click="sendMessage(messageObj, messageFiles)"
                >
                    <Icon icon="f7:paperplane-fill" width="25" />
                </button>
            </div>
        </div>
        <div class="files-container card">
            <h2>Project Files</h2>
            <div class="files">
                <dashboard-file-card
                    class="doc-card"
                    v-for="(file, index) of files"
                    :key="index"
                    :file="file"
                    download
                    :delete="false"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

const route = useRoute()
const { projectId } = route.query
const selectedProjectId = ref((projectId as string) || "")
const messagesContainer = ref<HTMLElement | null>(null)
const messageFiles = ref<File[]>([])
const sending = ref(false)
const hello = "hello"
const chatrooms = computed(() => {
    return $Projects.getByEmail($User.email)
})

watch(
    chatrooms,
    (newChatrooms) => {
        if (newChatrooms.length > 0 && !selectedProjectId.value) {
            selectedProjectId.value = newChatrooms[0].id
        }
    },
    { immediate: true }
)

const files = computed(() => {
    return $Files.getFilesByProjectId(selectedProjectId.value)
})

const messageFilesProper = computed(() => {
    return messageFiles.value.map((file) => {
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith("image/") ? "image" : "document"

        return {
            id: "",
            name: file.name,
            timestamp: Date.now(),
            url: url,
            type: type,
        } as ProjectFile
    })
})

const messages = computed(() => $Chatroom.getChatroomMessages(selectedProjectId.value) || [])
const message = ref("")
const messageObj = computed(() => {
    return {
        message: message.value,
        sender: $User.email,
        files: [],
    }
})

function removeFile(fileName: string) {
    const index = messageFiles.value.findIndex((file) => {
        return file.name === fileName
    })

    if (index !== -1) {
        messageFiles.value.splice(index, 1)
    }
}

watch(messages, () => {
    setTimeout(() => {
        scrollToBottom()
    }, 100)
})

async function sendMessage(messageObj: Omit<Message, "id" | "timestamp">, messageFiles: File[]) {
    if (!selectedProjectId) return
    if (messageObj.message.trim() === "" && !messageFiles.length) return

    if (messageFiles.length) {
        messageObj.files = await $Files.saveFiles(selectedProjectId.value, messageFiles, $User.email)
    }
    $Chatroom.sendMessage(selectedProjectId.value, messageObj)

    message.value = ""
    messageFiles = []
}

function scrollToBottom() {
    const container = messagesContainer.value
    if (container) {
        const lastMessage = container.lastElementChild

        if (lastMessage) {
            lastMessage.scrollIntoView({
                behavior: "smooth",
                block: "end",
            })
        }
    } else {
        throw new Error("No message container found")
    }
}

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        messageFiles.value.push(input.files[0])
    }
}
</script>

<style lang="scss" scoped>
section {
    display: flex;
    position: relative;
    z-index: 10;
    height: 100vh;
}

.card {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    background: $background-light;
    // border-radius: $border-radius;
}
.chatroom-selection {
    display: flex;
    flex-direction: column;
    flex: 1;
    // overflow-y: scroll;

    .project-card {
        padding: var(--page-gutter-sm);
        cursor: pointer;
        position: relative;

        &.active {
            background: $secondary;

            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                background: $primary;
                height: 100%;
                width: 3px;
                border-top-right-radius: 15px;
                border-bottom-right-radius: 15px;
            }
        }
    }
}
.no-messages {
    position: absolute;
    top: 25px;
    color: $text-light3;
    left: 50%;
    transform: translateX(-50%);
}
.files-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    flex: 1;
    padding-block: 25px;
    padding-inline: 25px;

    .files {
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
        justify-content: center;

        height: min-content;
    }
}

.chatroom {
    display: flex;
    flex-direction: column;
    max-width: 50%;
    flex: 2;
    position: relative;
    background: $text-light1;

    .messages-container {
        border-bottom: 2px solid $secondary;
        overflow-x: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
        padding: 15px;

        scroll-behavior: smooth;
        gap: 25px;
        max-width: 100%;
    }
}

// Message Input
.input-container {
    display: flex;
    gap: 10px;
    padding: 15px;
    max-width: 100%;
    background: white;

    .input-box {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        background: $secondary;
        border-radius: $border-radius;
        flex-direction: column;
        margin-top: auto;

        .input-wrapper {
            flex: 1;
            max-width: 100%;
            display: flex;
            gap: 5px;
            padding: 5px 10px;
            min-height: 50px;
            align-items: center;

            &.files {
                border-top: 1px solid $text-light3;
            }

            .message-input {
                max-height: 400px;
                flex: 1;
                border: none;
                background: transparent;
                font-size: 1rem;
                resize: none;
                field-sizing: content;

                &:focus {
                    outline: none;
                }

                &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            }
        }
    }

    button {
        height: 50px;
        margin-top: auto;
    }
}
.message-files {
    display: flex;
    gap: 25px;
    flex-wrap: wrap;
    padding: 15px 15px;
}
.file-input-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.file-input {
    display: none;
}

.file-button {
    font-size: 1.25rem;
    padding: 0.25rem;
}

.send-button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 5px 20px;
    background: $primary;
    color: white;
    border-radius: $border-radius;
    cursor: pointer;

    &:hover:not(:disabled) {
        background-color: $primary-light;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
