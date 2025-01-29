<template>
    <div class="message-container">
        <div
            class="message"
            :class="{
                contains: message.message.length,
                sent: message.sender === $User.email,
                recieved: message.sender !== $User.email,
            }"
        >
            <div class="bottom">
                <div class="sender">{{ message.sender }}</div>

                <rflex>
                    <div class="time">{{ formatTime(message.timestamp) }}</div>
                    <Icon icon="hugeicons:tick-double-01" v-if="delivered" />
                    <Icon icon="hugeicons:tick-01" v-else />
                </rflex>
            </div>

            <div v-if="message.message" class="content">
                {{ message.message }}
            </div>
        </div>
        <div
            class="files"
            :class="{
                sent: message.sender === $User.email,
                recieved: message.sender !== $User.email,
            }"
            v-if="files.length"
        >
            <dashboard-file-card-small
                :delete="false"
                :download="true"
                v-for="(file, index) of files"
                :key="index"
                :file="file"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const props = defineProps<{
    message: Message
}>()
const delivered = true
const files = computed(() => {
    return $Files.getFilesByIds(props.message.files)
})
function formatTime(timestampString: string): string {
    const timestamp = new Date(timestampString)
    let hours: number = timestamp.getHours()
    let minutes: number | string = timestamp.getMinutes()
    const ampm: string = hours >= 12 ? "pm" : "am"

    hours = hours % 12
    hours = hours ? hours : 12

    minutes = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutes} ${ampm}`
}
</script>

<style lang="scss" scoped>
.files {
    display: flex;
    gap: 25px;

    &.sent {
        align-items: flex-end;
        margin-left: auto;
    }
}
.message-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 0.9rem;
    max-width: 75%;

    padding-block: 15px;
    padding-inline: 25px;

    .bottom {
        transition: none;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 5px;
    }

    &.sent {
        align-items: flex-end;
        margin-left: auto;
        background: $primary-light;
        color: $text-light1;
        padding-right: 30px;
        border-radius: 20px;
        border-bottom-right-radius: 0px;

        &::before {
            content: "";
            position: absolute;
            right: -15px;
            bottom: 0px;
            background: $primary-light;
            z-index: 25;
            width: 15px;
            height: 10px;
        }

        &::after {
            content: "";
            position: absolute;
            right: -25px;
            bottom: -12px;
            z-index: 30;
            width: 25px;
            height: 25px;
            background: $text-light1;
            border-bottom-left-radius: 150px;
        }
    }

    &.recieved {
        margin-right: auto;
        background: white;
        text-align: left;

        border-radius: 20px;
        border-bottom-left-radius: 0;

        &::before {
            content: "";
            position: absolute;
            left: -15px;
            bottom: 0px;
            background: white;
            z-index: 25;
            width: 15px;
            height: 10px;
        }

        &::after {
            content: "";
            position: absolute;
            left: -25px;
            bottom: -12px;
            z-index: 30;
            width: 25px;
            height: 25px;
            background: $text-light1;
            border-bottom-right-radius: 150px;
        }
    }

    .sender {
        font-weight: 600;
        font-size: 0.75rem;
        text-align: left;
        margin: 0;
        z-index: 15;

        .bottom {
            margin-right: auto;
        }
    }

    .time {
        transition: none;
        font-size: 0.75em;
    }
}
</style>
