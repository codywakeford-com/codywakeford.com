<template>
    <div class="action" v-if="action">
        <h3 v-if="action.action === 'book-meeting'">Book a meeting</h3>
        <h3 v-if="action.action === 'accept-quote'">Accept the quote</h3>
        <h3 v-if="action.action === 'payment'">Make a payment</h3>
        <h3 v-if="action.action === 'accept-design'">Accept Design</h3>

        <p>{{ action.description }}</p>
        <div class="action-controls">
            <button-primary-m v-if="action.action === 'book-meeting'" @click="startBookMeeting()">
                Book a call
            </button-primary-m>
            <button-primary-m
                v-if="action.action === 'accept-quote'"
                @click="ProjectController.acceptProjectProposal(projectId)"
            >
                Accept Quote
            </button-primary-m>
            <button-primary-m
                @click="
                    ($BillingModal.openPaymentModal($Projects.getAmountToPay(projectId)),
                    ($Actions.state.selectedActionId = action.id))
                "
                v-if="action.action === 'payment'"
            >
                Make a payment
            </button-primary-m>
            <button-primary-m v-modal="'design-modal'" v-if="action.action === 'accept-design'">
                View Design
            </button-primary-m>
            <button-primary-m
                v-if="action.action === 'accept-design'"
                @click="ProjectController.acceptDesign(projectId)"
            >
                Accept Design
            </button-primary-m>
        </div>
    </div>
</template>

<script setup lang="ts">
import ActionController from "~~/controllers/ActionsController"
import ProjectController from "~~/controllers/ProjectsController"

const projectId = useRoute().params.id as string
const action = computed(() => {
    const sortedActions = $Actions.getPendingByProjectId(projectId).sort((a, b) => {
        return a.priority - b.priority
    })

    return sortedActions[0]
})

function startBookMeeting() {
    $Calendly.open()
    $Actions.state.selectedActionId = action.value.id
}
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
        gap: 10px;
        justify-content: flex-end;
        margin-top: 10px;
    }
}
</style>
