<template>
    <rflex class="header-row">
        <header>
            <h1>Project Details</h1>
            <h5>Phase: {{ project.phase }}</h5>
        </header>

        <div class="action-required">
            <h2>Action Required</h2>
            <p>Please complete "{{ project.action }}"</p>
        </div>
    </rflex>

    <rflex class="action-buttons">
        <btn v-if="project.action === 'meeting'">
            <CalendlyPopupButton v-bind="options" :root-element="rootElement" />
        </btn>

        <btn v-if="project.meeting">
            <anchor :to="project.meeting?.rescheduleUrl" target="_blank">Reschedule Call</anchor>
        </btn>

        <btn v-if="project.meeting">
            <anchor :to="project.meeting?.cancelUrl" target="_blank">Cancel Call</anchor>
        </btn>

        <btn v-if="project.meeting">
            <anchor :to="project.meeting?.meetingUrl" target="_blank">Join Meeting</anchor>
        </btn>

        <btn>Report an Issue</btn>

        <btn v-if="project.quote?.amountPaid < project.quote?.totalAmount">Make a payment</btn>
    </rflex>

    <!-- Shows a message based on the phase. -->
    <!-- <ProjectPhaseMessage :phase="project.phase" /> -->

    <!-- Accept the design. TODO: show only after design meeting. -->
    <div v-if="project.phase === 'design'">
        <btn modal="finalDesign">Accept Final Design</btn>
        <modal id="finalDesign">
            Are you sure?
            <btn @click="closeModal('finalDesign')">Close</btn>
            <btn
                @click="
                    $Projects.updatePhase(project.id, $Projects.getNextProjectPhase(project.phase))
                "
                >Accept Design</btn
            >
        </modal>
    </div>

    <!-- Display quote shown when first quote is given. -->
    <div v-if="project.quote && project.phase === 'discovery'">
        <cflex v-if="project.quote">
            <h4>A project proposal has been submitted</h4>

            <btn modal="pdfModal" @click="selectedDoc = project.quote.proposalUrl"
                >View Proposal</btn
            >
            <btn modal="pdfModal" @click="selectedDoc = project.quote.proposalUrl">View Quote</btn>

            <rflex>
                <btn modal="offerAccepted">Accept Offer</btn>
                <button class="calendly-button">
                    <CalendlyPopupButton v-bind="options" :root-element="rootElement" />
                </button>
                <btn :to="`/admin/projects/chatrooms/${project.id}`">Send us a message</btn>
                <btn>Decline Offer</btn>
            </rflex>
        </cflex>
    </div>
    <modal id="pdfModal">
        <embed :src="selectedDoc" type="application/pdf" width="900px" height="1200px" />
    </modal>

    <pre>{{ project.meeting }}</pre>
    <!-- rootElement is for calendly -->
    <div ref="rootElement"></div>
</template>

<script setup lang="ts">
import { velorisStaffEmails } from "~/stores/notifications"

const route = useRoute()
const projectId = route.params.id as string
const selectedDoc = ref("")
const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

const rootElement = ref()
const options = {
    url: "https://calendly.com/codypwakeford/veloris-project-meeting",
    text: "Book a call",
}

useCalendlyEventListener({
    onEventScheduled: (event) => {
        const velorisMeetingUrl = event.data.payload.event.uri
        const clientMeetingUrl = event.data.payload.invitee.uri

        $Projects.meetingScheduled(project.value.id, velorisMeetingUrl, clientMeetingUrl)

        if (project.value.phase === "onboarding") {
            $Projects.incrementPhase(project.value.id)
        }
    },
})
</script>

<style lang="sass" scoped>
.header-row
    gap: 25px
    align-items: start
    height: 120px
    margin-block: 0px 20px

    header
        display: flex
        flex-direction: column
        gap: 5px
        background: white
        padding: 20px 20px
        border-radius: 5px
        flex-grow: 1
        height: 100%

        h1
            font-size: 2rem
            font-weight: bold

    .action-required
        display: flex
        flex-direction: column
        gap: 5px
        background: white
        height: 100%
        padding: 20px
        border-radius: 5px

        h2
            font-weight: bold
            font-size: 1rem

.action-buttons
    gap: 10px
    margin-bottom: 25px

.calendly-button
    background: red

.meeting-link
    color: blue

.offer-accepted-modal
    background: white
    padding: 50px

.payment-plan-button
    &.active
        border: 1px solid blue
</style>
