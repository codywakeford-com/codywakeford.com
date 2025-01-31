<template>
    <div class="action" v-if="action">
        <h3 v-if="action.action === 'book-meeting'">Book a meeting</h3>
        <h3 v-if="action.action === 'accept-quote'">Accept the quote</h3>
        <h3 v-if="action.action === 'payment'">Make a payment</h3>

        <p>{{ action.description }}</p>
        <div class="action-controls">
            <button-primary-m v-if="action.action === 'book-meeting'">
                <CalendlyPopupButton
                    class="calendly-button"
                    v-bind="options"
                    :cancelOptions="cancelOptions"
                    :root-element="rootElement"
                />
            </button-primary-m>

            <button-primary-m
                v-if="action.action === 'accept-quote'"
                @click="$Projects.acceptProjectProposal(projectId, action.id)"
                >Accept Quote</button-primary-m
            >

            <button-primary-m
                v-modal="`paymentModal`"
                @click="$Actions.selectedActionId = action.id"
                v-if="action.action === 'payment'"
            >
                Make a payment
            </button-primary-m>
        </div>
    </div>

    <!-- rootElement is for calendly -->
    <div ref="rootElement"></div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const rootElement = ref()

const projectId = useRoute().params.id as string

const options = {
    url: "https://calendly.com/codypwakeford/meeting",
    text: "Book a call",
}

const cancelOptions = {
    url: "",
}

const action = computed(() => {
    const sortedActions = $Actions.getPendingByProjectId(projectId).sort((a, b) => {
        return a.priority - b.priority
    })

    return sortedActions[0]
})

useCalendlyEventListener({
    onEventScheduled: (event) => {
        const staffMeetingUrl = event.data.payload.event.uri
        const clientMeetingUrl = event.data.payload.invitee.uri

        $Projects.meetingScheduled(projectId, staffMeetingUrl, clientMeetingUrl)
        $Actions.markAsComplete(action.value.id)
    },
})
</script>

<style lang="scss" scoped>
.action {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 15px;

    h3 {
        margin-bottom: 5px;
    }

    p {
        font-size: 0.9rem;
    }

    .action-controls {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }
}
</style>
