<template>
    <div class="system-message" v-if="activity.type === 'system-message'">
        <rflex>
            <div class="sender">System:</div>
            <div class="messagee">
                {{ activity.message }}
            </div>
        </rflex>
        <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
        <!-- <div v-for="action in getActivityActions(activity.actions)">
                <button-primary-m v-if="activity.action.type === 'payment'" @click="openModal('paymentModal')">
                    Make Payment
                </button-primary-m>

                <button-primary-m
                    v-if="activity.action.type === 'accept-design'"
                    @click="$Projects.clientAcceptsDesign(props.project.id)"
                >
                    Accept Design
                </button-primary-m>
            </div> -->
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
