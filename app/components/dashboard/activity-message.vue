<template>
    <div class="activity-item" v-if="activity">
        <dashboard-activity-log-phase-message v-if="activity.type === 'phase'" :activity="activity" />
        <dashboard-activity-log-system-message v-if="activity.type === 'system-message'" :activity="activity" />
        <dashboard-activity-log-meeting v-if="activity.type === 'meeting'" :activity="activity" />
        <dashboard-activity-log-quote v-if="activity.type === 'quote'" :activity="activity" />
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

<style lang="scss" scoped>
.activity-item {
    width: 100%;
    padding-block: 15px;
}

.timestamp {
    font-size: 0.8rem;
    font-weight: 500;
}

.sender {
    font-weight: 700;
    font-size: 0.9rem;
}

.btn {
    margin-top: 5px;
    width: min-content;
    white-space: nowrap;
}
</style>
