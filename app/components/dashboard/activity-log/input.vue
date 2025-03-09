<template>
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
        <button
            type="button"
            class="send-button"
            :disabled="sending"
            @click="ActivityLogController.sendMessage(projectId, message, messageFiles)"
        >
            <Icon name="f7:paperplane-fill" size="25" />
        </button>
    </div>
</template>

<script setup lang="ts">
import ActivityLogController from "~~/controllers/ActivityLogController"

const projectId = useRoute().params.id as string
const sending = ref(false)
const message = ref("")
const messageFiles = ref<File[]>([])

const messageFilesProper = computed(() => {
    return messageFiles.value.map((file) => {
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith("image/") ? "image" : "document"

        return {
            id: "",
            name: file.name,
            timestamp: Date.now(),
            url: url,
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
function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        messageFiles.value.push(input.files[0])
    }
}
</script>

<style scoped lang="scss">
// Message Input
.input-container {
    display: flex;
    gap: 10px;
    padding: 15px;
    max-width: 100%;
    background: var(--background);
    border-radius: $border-radius;

    button {
        height: 50px;
        margin-top: auto;
    }
}

.input-box {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    background: var(--secondary);
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
            border-top: 1px solid var(--text3);
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

.iconify {
    color: var(--text1);
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
    background: var(--primary);
    color: var(--text1);
    border-radius: $border-radius;
    cursor: pointer;

    &:hover:not(:disabled) {
        background-color: var(--primary2);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
