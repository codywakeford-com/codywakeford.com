<template>
    <div class="meeting" v-if="meeting">
        <h3>Upcoming Meeting</h3>
        <div class="meeting-details" v-if="meeting">
            <rflex class="atendees">
                <Icon size="20" name="material-symbols:person-outline" />
                <span>{{ meeting.clients[0]?.name }}</span>
            </rflex>
            <rflex class="time">
                <Icon size="20" name="uil:calender" />
                <span>{{ dayjs(meeting.startTime).format("dddd Do MMMM YYYY, HH:mma ") }}</span>
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
            <nuxt-link target="_blank" :to="meeting.meetingUrl">
                <button-primary-m>Join Meeting</button-primary-m>
            </nuxt-link>
            <button-primary-m @click="$Calendly.openReschedule(meeting.rescheduleUrl)">
                Reschedule Meeting
            </button-primary-m>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)
const $Meetings = useMeetingStore()
const $Calendly = useCalendlyStore()
const projectId = useRoute().params.id as string

const meeting = computed(() => {
    return $Meetings.getByProjectId(projectId)[0]
})
</script>

<style lang="scss" scoped>
.meeting {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .rflex {
        gap: 5px;
    }

    .meeting-details {
        display: flex;
        flex-direction: column;
        background: var(--background);
        font-size: 1rem;
        gap: 5px;
        max-width: min-content;
        border-radius: $border-radius;
        min-width: 300px;

        .rflex {
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
        justify-content: flex-end;
        margin-top: 15px;
        font-size: 0.9rem;
    }
}
</style>
