<template>
    <div class="menu" v-if="project">
        <div class="menu-item">Make a payment</div>
        <div class="menu-item">Request a change</div>

        <nuxt-link :to="`/dashboard/chatroom?projectId=${props.project?.id}`" class="menu-item"
            >Send a message</nuxt-link
        >

        <div class="menu-item">View Design File</div>
        <div class="menu-item">Accept Deliverable</div>

        <div class="menu-item">
            <Icon icon="streamline:group-meeting-call" width="20px" />
            <CalendlyPopupButton class="calendly-button" v-bind="options" :root-element="rootElement" />
        </div>

        <div class="menu-item" v-if="project.meeting">
            <CalendlyPopupButton
                v-if="project.meeting"
                class="calendly-button"
                v-bind="{ url: project.meeting.rescheduleUrl, text: 'Reschedule Meeting' }"
                :root-element="rootElement"
            />
        </div>
    </div>
    <!-- rootElement is for calendly -->
    <div ref="rootElement"></div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const rootElement = ref()

interface Props {
    project: Project
}

const props = defineProps<Props>()

const options = {
    url: "https://calendly.com/codypwakeford/meeting",
    text: "Book a call",
}

const cancelOptions = {
    url: "",
}

useCalendlyEventListener({
    onEventScheduled: (event) => {
        const staffMeetingUrl = event.data.payload.event.uri
        const clientMeetingUrl = event.data.payload.invitee.uri
        $Projects.meetingScheduled(props.project.id, staffMeetingUrl, clientMeetingUrl)

        console.log("helllooooo")
    },

    onDateAndTimeSelected: (event) => {
        console.log(event)
    },
})
</script>

<style lang="scss" scoped>
.menu {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .menu-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 30px;

        &:hover {
            background: $secondary;
        }
    }
}

.calendly-button {
    display: none;
    background: none !important;
}
</style>
