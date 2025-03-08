<template>
    <div class="meeting">
        <rflex>
            <div class="sender">{{ activity.sender }}</div>
            <span>has booked a meeting.</span>
        </rflex>
        <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>

        <div class="meeting-details" v-if="meeting">
            <rflex class="atendees">
                <Icon size="20" name="material-symbols:person-outline" />
                <span>{{ activity.sender }}</span>
            </rflex>
            <rflex class="time">
                <Icon size="20" name="uil:calender" />
                <span>{{ dayjs(meeting.timestamp).format("dddd Do MMMM YYYY, HH:mma ") }}</span>
            </rflex>

            <rflex>
                <Icon size="20" name="material-symbols:globe" />
                <span>UK, Ireland, Lisbon Time</span>
            </rflex>

            <rflex class="status">
                <Icon size="20" name="gridicons:stats" />
                <span>{{ meeting.status }}</span>
            </rflex>
        </div>

        <div class="controls">
            <nuxt-link target="_blank" :to="meeting?.meetingUrl">Join Meeting</nuxt-link>
            <nuxt-link target="_blank" :to="meeting?.rescheduleUrl">Reschedule Meeting</nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const props = defineProps<{
    activity: MeetingActivityItem
}>()

const meeting = computed(() => {
    if (props.activity.type !== "meeting") return null

    return $Meetings.getByMeetingId(props.activity.meetingId)
})
</script>

<style scoped lang="scss">
.meeting {
    display: flex;
    flex-direction: column;

    .rflex {
        gap: 5px;
    }

    .meeting-details {
        display: flex;
        flex-direction: column;
        background: var(--background);
        margin-top: 10px;
        padding: 10px;
        font-size: 1rem;
        gap: 5px;
        font-size: 0.9rem;
        max-width: min-content;
        border-radius: $border-radius;
        min-width: 300px;

        .rflex {
            font-size: 0.8rem;
            gap: 15px;
        }

        svg {
            color: var(--text6);
        }

        .status {
            text-transform: capitalize;
        }
    }

    .controls {
        display: flex;
        gap: 10px;
    }

    a {
        margin-top: 10px;
        color: blue;
        font-size: 0.8rem;
    }

    .actions {
        margin-block: 10px;
    }
}
</style>
