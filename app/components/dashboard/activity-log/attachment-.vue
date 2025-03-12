<template>
    <div class="attachment" v-if="activity.type === 'attachment'">
        <span class="attachment-message">
            <div class="sender">{{ activity.sender }}</div>
            <span>uploaded an attachment</span>
        </span>
        <span class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</span>

        <dashboard-file-card v-for="file in files" :key="file.id" :file="file" />
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const props = defineProps<{
    activity: AttachmentActivityItem
}>()
const files = computed(() => {
    return $Files.getFilesByIds(props.activity.files)
})
</script>

<style scoped lang="scss"></style>
