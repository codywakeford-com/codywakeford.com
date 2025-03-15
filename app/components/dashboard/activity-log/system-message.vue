<template>
    <div class="system-message" v-if="activity.type === 'system-message'">
        <rflex>
            <div class="sender">System:</div>
            <div class="messagee">
                {{ activity.message }}
            </div>
        </rflex>
        <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const props = defineProps<{
    activity: SystemMessageActivityItem
}>()
</script>

<style scoped lang="scss">
@use "~/style/activity-log.scss" as *;
.system-message {
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: var(--text6);
    font-size: 0.9rem;
    font-weight: 700;
    margin-block: 5px 10px;

    .timestamp {
        color: var(--text6);
    }

    .rflex {
        align-items: flex-start;
        gap: 10px;
    }
}
</style>
