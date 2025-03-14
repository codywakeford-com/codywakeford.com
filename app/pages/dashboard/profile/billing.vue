<template>
    <section class="profile-page">
        <header class="page-header">
            <h1>Billing Details</h1>
            <p>
                Your billing information is securely stored and can be updated at any time. Please ensure your details
                are accurate to avoid any service interruptions.
            </p>
        </header>

        <section>
            <header class="sub-header">
                <h2>PAYMENT METHODS</h2>
            </header>
            <div class="saved-cards">
                <stripe-payment-method v-for="(card, index) in $User.state.paymentMethods" :key="index" :card="card" />

                <button @click="$BillingModal.openAddCardModal" class="add-card">
                    <Icon class="add-icon" name="material-symbols:add" size="20" />
                    <label for="">Add Payment Method</label>
                </button>
            </div>
        </section>

        <section>
            <header class="sub-header">
                <h2>MY SUBSCRIPTIONS</h2>
            </header>
            <profile-subscription-card v-for="sub of subs" :subscription="sub" />
        </section>

        <section>
            <header class="sub-header">
                <h2>BILLING HISTORY</h2>
            </header>
            <dashboard-billing-history />
        </section>
    </section>
</template>

<script setup lang="ts">
const $BillingModal = useBillingModalStore()
const $User = useUserStore()

const subs = ref([
    {
        projectId: "123123",
        projectName: "Website development",
        amount: 10000,
        period: "monthly",
    },
])

definePageMeta({
    layout: "dashboard-profile",
    middleware: "dashboard",
})
</script>

<style scoped lang="scss">
@use "~/style/profile.scss" as *;
main {
    padding-block: 25px;

    h1 {
        font-size: 1.5rem;
    }
}
.profile-page {
    max-width: 925px;
}
.saved-cards {
    display: flex;
    gap: 15px;
    padding-block: 25px;
    overflow-x: scroll;
    max-width: 100%;

    .add-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        min-width: 300px;

        align-items: center;
        border-radius: 10px;
        border: 1px solid var(--text2);
        background: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 0.9rem;

        width: 300px;
        height: 175px;

        .add-icon {
            box-sizing: content-box;
            border: 1px solid var(--text2);
            border-radius: 50%;
            padding: 5px;
        }

        &:hover {
            background: var(--background);
            border: 1px solid var(--primary);
        }
    }
}

.save-card-modal {
    max-width: 850px;
    background: var(--background);
    padding: 25px;
    border-radius: $border-radius;
}
</style>
