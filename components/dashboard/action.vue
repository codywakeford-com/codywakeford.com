<template>
    <div class="action" v-if="action">
        <h3 v-if="action.action === 'book-meeting'">Book a meeting</h3>
        <h3 v-if="action.action === 'accept-quote'">Accept the quote</h3>
        <h3 v-if="action.action === 'payment'">Make a payment</h3>
        <h3 v-if="action.action === 'accept-design'">Accept Design</h3>

        <p>{{ action.description }}</p>
        <div class="action-controls">
            <button-primary-m v-if="action.action === 'book-meeting'" @click="openCalendly()"> Book a call
            </button-primary-m>

            <button-primary-m v-if="action.action === 'accept-quote'"
                @click="$Projects.acceptProjectProposal(projectId, action.id)">Accept Quote</button-primary-m>

            <button-primary-m @click="(showModalById('payment-modal'), ($Actions.selectedActionId = action.id))"
                v-if="action.action === 'payment'">
                Make a payment
            </button-primary-m>

            <button-primary-m v-modal="'design-modal'" v-if="action.action === 'accept-design'">View
                Design</button-primary-m>
            <button-primary-m v-if="action.action === 'accept-design'"
                @click="($Projects.clientAcceptsDesign(projectId), $Actions.markAsComplete(action.id))">Accept
                Design</button-primary-m>
        </div>
    </div>

    <!-- rootElement is for calendly -->
    <div ref="rootElement"></div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const rootElement = ref()

const projectId = useRoute().params.id as string

const project = computed(() => {
    return $Projects.getProjectById(projectId) || null
})

const action = computed(() => {
    const sortedActions = $Actions.getPendingByProjectId(projectId).sort((a, b) => {
        return a.priority - b.priority
    })

    return sortedActions[0]
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
        gap: 10px;
        justify-content: flex-end;
        margin-top: 10px;
    }
}
</style>
