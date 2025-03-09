<template>
    <div class="phase">
        <div class="top">
            <div class="divider" />

            <div class="text" v-if="activity.phaseTo === 'discovery'">
                Project initiated: Now in the Discovery Phase
            </div>

            <div class="text" v-else-if="activity.phaseTo === 'live'">Your website is live!</div>

            <div v-else class="text">Project moved to the {{ activity.phaseTo }} phase!</div>
            <div class="divider" />
        </div>

        <div class="bottom timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const props = defineProps<{
    activity: PhaseActivityItem
}>()
</script>

<style scoped lang="scss">
@use "~/style/activity-log.scss" as *;

.phase {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    .top {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
        max-height: 20px;

        .divider {
            height: 1px;
            background: var(--text2);
        }

        .text {
            font-size: 0.9rem;
            font-weight: 700;
            white-space: nowrap;
        }
    }
}
</style>
