<template>
    <div class="message-container">
        <div
            class="files"
            :class="{
                sent: message.sender === $User.email,
                recieved: message.sender !== $User.email,
            }"
            v-if="message.files.length"
        >
            <dashboard-file-card-small v-for="(file, index) of message.files" :key="index" :file="file" />
        </div>
        <div
            class="message"
            :class="{
                contains: message.message.length,
                sent: message.sender === $User.email,
                recieved: message.sender !== $User.email,
            }"
        >
            <div v-if="message.message" class="content">
                {{ message.message }}
            </div>

            <rflex class="message-details">
                <div class="sender" v-if="message.sender !== $User.email">{{ message.sender }}</div>
                <div class="time">{{ dayjs(message.timestamp).format(" hh:mma") }}</div>
                <Icon name="hugeicons:tick-double-01" v-if="delivered" />
                <Icon name="hugeicons:tick-01" v-else />
            </rflex>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const $User = useUserStore()

const props = defineProps<{
    message: Message
}>()

const delivered = true
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
    gap: 0px;
}

.message {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    max-width: 400px;

    .content {
        padding-block: 10px;
        padding-inline: 25px;
        border-radius: 10px;
        margin-bottom: 5px;
        width: fit-content;
    }

    &.sent {
        align-items: flex-end;
        margin-left: auto;

        .content {
            background: var(--primary2);
            color: var(--text1);
            border-bottom-right-radius: 0px;
            margin-bottom: 5px;
        }

        .time {
            margin-left: auto !important;
        }
    }

    &.recieved {
        margin-right: auto;
        background: var(--background);
        text-align: left;

        border-radius: 20px;
        border-bottom-left-radius: 0;

        .content {
            background: var(--text1);
            color: var(--text4);
            border-bottom-left-radius: 0px;
            margin-bottom: 5px;
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

    .message-details {
        display: flex;

        gap: 3px;

        .time {
            transition: none;
            font-size: 0.75em;
        }
    }
}
</style>
