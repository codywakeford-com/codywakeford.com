<template>
    <div class="attachment" v-if="activity.type === 'attachment'">
        <span class="attachment-message" v-if="activity.files.length > 1">
            <div class="sender">
                <!-- {{ getFilesForActivity(activity)[0]?.sender }} -->
            </div>

            uploaded
            {{ activity.files.length }} attachments
        </span>
        <span class="attachment-message" v-else>
            <div class="sender">
                <!-- {{ getFilesForActivity(activity)[0].sender }} -->
            </div>
            uploaded an attachment
        </span>
        <span class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</span>

        <!-- <dashboard-file-card-small  v-for="file in getFilesForActivity(activity)" :key="file.id" :file="file" /> -->
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const props = defineProps<{
    activity: ActivityItem
}>()
</script>

<style scoped lang="scss"></style>
