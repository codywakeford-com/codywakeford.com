<template>
    <header>
        <h1>Project Billing</h1>
    </header>
    <rflex class="billing-stats">
        <div class="stat-card">
            <h2>Project Total</h2>
            <h3 v-if="project.quote?.totalAmount">£{{ project.quote?.totalAmount / 100 }}</h3>
        </div>

        <div class="stat-card">
            <h2>Amount Paid</h2>
            <h3>£{{ project.quote?.amountPaid || 0 / 100 }}</h3>
        </div>

        <div class="stat-card">
            <h2>Next Payment</h2>
            <h3>date</h3>
        </div>

        <div class="stat-card">
            <h2>Est Project Completion</h2>
            <h3>date</h3>
        </div>
    </rflex>

    <rflex class="payment-invoice-box">
        <cflex class="payment-history">Payment history</cflex>
        <cflex class="invoice-list">Invoice List</cflex>
    </rflex>

    <rflex class="payments-subscriptions-box">
        <cflex class="payment-methods"> Payment Methods</cflex>
        <cflex class="subscriptions">Ongoing subscriptions</cflex>
    </rflex>
    <pre>
        billing page

        * Invoice list
        * Current plan
        * Payment History
    </pre>

    <StripePayment
        :options="stripeOptions"
        :metadata="StripeMetadata"
        :project="project"
        :paymentPlan="selectedPaymentPlan"
        :onPayment="onDiscoveryPayment"
    />

    <!-- Payment for devlopment. Development starts after payment. -->
    <div v-if="project.paymentPlan === 'three' && project.phase === 'development'">
        <StripePayment
            :options="stripeOptions"
            :metadata="StripeMetadata"
            :project="project"
            :paymentPlan="selectedPaymentPlan"
            :onPayment="onDevelopmentPayment"
        />
    </div>

    <!-- Payment upon website completion. After this website will be launched. -->
    <div v-if="project.paymentPlan === 'three' && project.phase === 'launch'">
        <StripePayment
            :options="stripeOptions"
            :metadata="StripeMetadata"
            :project="project"
            :paymentPlan="selectedPaymentPlan"
            :onPayment="onLaunchPayment"
        />
    </div>
    <modal id="offerAccepted">
        <div class="offer-accepted-modal">
            <!-- TODO: add doc signing -->
            <h6>Payment plans</h6>
            <rflex>
                <btn
                    class="payment-plan-button"
                    @click="(selectedPaymentPlan = 'three'), (project.paymentPlan = 'three')"
                    :class="{ active: selectedPaymentPlan === 'three' }"
                    >3 Installments</btn
                >
                <btn
                    class="payment-plan-button"
                    @click="(selectedPaymentPlan = 'one'), (project.paymentPlan = 'one')"
                    :class="{ active: selectedPaymentPlan === 'one' }"
                    >1 Installment</btn
                >
            </rflex>
        </div>
    </modal>
</template>

<script setup lang="ts">
const selectedPaymentPlan = ref<Project["paymentPlan"]>("one")

const route = useRoute()
const projectId = route.params.id as string

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

const amountDue = computed(() => {
    if (!project.value.quote) return 0

    const paymentItems: ProjectQuoteItem[] = project.value.quote.items.filter((item) => {
        return item.paymentType === "payment"
    })

    let total = 0

    paymentItems.forEach((item) => {
        total += item.amount
    })

    if (selectedPaymentPlan.value === "three" || project.value.paymentPlan === "three") {
        total = Math.ceil(total / 3)
    }

    return total
})

const stripeOptions = computed((): StripePaymentOptions => {
    return {
        amount: amountDue.value,
        currency: "gbp",
    }
})

const StripeMetadata: StripeMetaData = {
    taxRate: 0,
    description: "Web development services.",
}

// Funtions passed to stripe as a callback.

// Final payment callback
function onLaunchPayment(paymentRecord: PaymentRecord) {
    $Payment.createRecord(paymentRecord)
    $Projects.updateAmountPaid(project.value.id, paymentRecord.totalPaid)
}

// 2nd payment callback (if required)
function onDevelopmentPayment(paymentRecord: PaymentRecord) {
    $Payment.createRecord(paymentRecord)
    $Projects.updateAmountPaid(project.value.id, paymentRecord.totalPaid)
}

// Fired when the client accepts the quote and makes intial payment. //
function onDiscoveryPayment(paymentRecord: PaymentRecord) {
    $Payment.createRecord(paymentRecord)
    $Projects.updateAmountPaid(project.value.id, paymentRecord.totalPaid)
    $Projects.setPaymentPlan(project.value.id, selectedPaymentPlan.value)
    $Projects.updatePhase(project.value.id, $Projects.getNextProjectPhase(project.value.phase))

    // Notify staff
    $Notifications.create({
        message: "Quote Accepeted",
        mode: "success",
        title: `${project.value.name} has accepted the quote and made initial payment.`,
        to: velorisStaffEmails,
        type: "client",
    })
}
</script>

<style lang="sass" scoped>
header
    margin-block: 0px 20px

    h1
        font-size: 2rem
        font-weight: bold


.billing-stats
    gap: 25px

    .stat-card
        display: flex
        flex-direction: column
        justify-content: space-between
        background: white
        min-width: 250px
        padding: 15px 20px
        border-radius: 5px
        gap: 15px
        flex-grow: 1

        h2
            font-size: 1.15rem

        h3
            font-weight: bold
            font-size: 1.75rem

.payment-invoice-box
    width: 100%
    gap: 25px

    align-items: start
    margin-top: 25px

    .payment-history
        background: white
        flex-grow: 1
        border-radius: 5px
        padding: 20px
        min-height: 200px

    .invoice-list
        background: white
        flex-grow: 1
        border-radius: 5px
        padding: 20px
        min-height: 200px

.payments-subscriptions-box
    width: 100%
    gap: 25px

    align-items: start
    margin-top: 25px

    .payment-methods
        background: white
        flex-grow: 1
        border-radius: 5px
        padding: 20px
        min-height: 250px

    .subscriptions
        min-width: 350px
        background: white
        border-radius: 5px
        padding: 20px
        min-height: 250px
</style>
