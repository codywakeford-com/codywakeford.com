<template>
    <section class="chatroom">
        <div class="messages-container" ref="messagesContainer">
            <div v-for="(item, index) of $ActivityLogs.getByProjectId(projectId)" :key="index">
                <dashboard-message v-if="item.type === 'message'" :message="item" />
                <dashboard-activity-message v-else :activity="item" />
            </div>
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
                        @keyup.enter="ActivityLogController.sendMessage(projectId, message, messageFiles)"
                    />
                    <label class="file-input-label">
                        <input type="file" @change="handleFileSelect" class="file-input" :disabled="sending" />
                        <Icon name="gravity-ui:paperclip" size="20" />
                    </label>
                </div>
            </div>
            <button type="button" class="send-button" :disabled="sending" @click="ActivityLogController.sendMessage(projectId, message, messageFiles)">
                <Icon name="f7:paperplane-fill" size="25" />
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import ActivityLogController from "~~/controllers/ActivityLogController"

const projectId = useRoute().params.id as string
const message = ref("")
const messagesContainer = ref<HTMLElement | null>(null)
const messageFiles = ref<File[]>([])
const sending = ref(false)

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

function removeFile(fileName: string) {
    const index = messageFiles.value.findIndex((file) => {
        return file.name === fileName
    })

    if (index !== -1) {
        messageFiles.value.splice(index, 1)
    }
}

watch($ActivityLogs.state.log, () => {
    setTimeout(() => {
        scrollToBottom()
    }, 0)
})

function scrollToBottom() {
    const container = messagesContainer.value
    if (container) {
        const lastMessage = container.lastElementChild

        if (lastMessage) {
            container.scrollTop = container.scrollHeight
        }
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
.card {
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    background: $background-light;
    // border-radius: $border-radius;
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
    height: 100%;
    position: relative;

    .messages-container {
        border-bottom: 2px solid $secondary;
        overflow-x: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-inline: 35px;
        padding-block: 25px 50px;
        scroll-behavior: smooth;
        max-height: calc(100vh - 325px);
        gap: 25px;
    }
}

// Message Input
.input-container {
    display: flex;
    gap: 10px;
    padding: 15px;
    max-width: 100%;
    background: white;
    border-radius: $border-radius;

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
