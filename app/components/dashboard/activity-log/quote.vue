<template>
    <div class="quote">
        <!-- Quote -->
        <span>
            <div class="sender">codypwakeford@gmail.com</div>
            has uploaded the project proposal
        </span>
        <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>

        <div class="attachments">
            <dashboard-file-card-small v-if="quote" v-for="file in quote.files" :file="file" />
        </div>

        <div class="system-message">
            System: This document puts my understanding of the project in writing so we are clear on what is expected.
            Please review the proposal and let me know if you would like to ammend anything.
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const projectId = useRoute().params.id as string
const props = defineProps<{
    activity: QuoteActivityItem
}>()

const files = computed(() => {
    return $Files.getByProjectId(projectId)
})

const quote = computed(() => {
    return $Projects.quote(projectId)
})
</script>

<style scoped lang="scss">
@use "~/style/activity-log.scss" as *;
.quote {
    display: flex;
    flex-direction: column;

    .attachments {
        display: flex;
    }

    .attachment-message {
        display: flex;
        gap: 5px;
        font-size: 0.9rem;

        .sender {
            font-weight: 700;
            font-size: 0.9rem;
        }
    }
}

.quote {
    span {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .sender {
        font-weight: 700;
        font-size: 0.9rem;
    }
}

.message {
    .rflex {
        gap: 5px;
    }
}
</style>
