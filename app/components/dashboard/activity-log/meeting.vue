<template>
    <div class="meeting">
        <div class="row">
            <div class="sender">{{ activity.sender }}</div>
            <span>has booked a meeting.</span>
        </div>
        <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>

        <div class="meeting-details" v-if="meeting">
            <div class="atendees">
                <Icon size="20" name="material-symbols:person-outline" />
                <span>{{ activity.sender }}</span>
            </div>
            <div class="time">
                <Icon size="20" name="uil:calender" />
                <span>{{ dayjs(meeting.timestamp).format("dddd Do MMMM YYYY, HH:mma ") }}</span>
            </div>

            <div>
                <Icon size="20" name="material-symbols:globe" />
                <span>UK, Ireland, Lisbon Time</span>
            </div>

            <div class="status">
                <Icon size="20" name="gridicons:stats" />
                <span>{{ meeting.status }}</span>
            </div>
        </div>

        <div class="controls">
            <nuxt-link target="_blank" :to="meeting?.meetingUrl">
                <button-primary-m>Join Meeting</button-primary-m>
            </nuxt-link>

            <nuxt-link target="_blank" :to="meeting?.rescheduleUrl">
                <button-primary-m>Reschedule Url</button-primary-m>
            </nuxt-link>
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
@use "~/style/activity-log.scss" as *;
.meeting {
    display: flex;
    flex-direction: column;

    .row {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .meeting-details {
        display: flex;
        flex-direction: column;
        background: var(--background);
        margin-top: 10px;
        padding-block: 10px;
        font-size: 1rem;
        gap: 5px;
        max-width: min-content;
        border-radius: $border-radius;
        min-width: 300px;

        div {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
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
