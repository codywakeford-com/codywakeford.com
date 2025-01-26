<script setup lang="ts">
import { Icon } from "@iconify/vue"
const stripeCard = ref(null)

const savedCards = computed(() => {
    return $User.stripePaymentProfile?.paymentMethods || []
})

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>
<template>
    <main>
        <h1>Payment Methods</h1>
        <div class="saved-cards">
            <stripe-payment-method v-for="(card, index) in savedCards" :key="index" :card="card" />

            <btn modal="save-card-modal" class="add-card">
                <Icon class="add-icon" icon="material-symbols:add" width="20" />
                <label for="">Add Payment Method</label>
            </btn>
        </div>

        <dashboard-billing-history />
    </main>
</template>

<style lang="scss" scoped>
main {
    padding-block: 25px;

    h1 {
        font-size: 1.5rem;
    }
}
.saved-cards {
    display: flex;
    gap: 15px;
    padding-block: 25px;

    .add-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        align-items: center;
        border-radius: 10px;
        border: 1px solid $text-light2;
        background: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 0.9rem;

        width: 300px;
        height: 175px;

        .add-icon {
            box-sizing: content-box;
            border: 1px solid $text-light2;
            border-radius: 50%;
            padding: 5px;
        }

        &:hover {
            background: white;
            border: 1px solid $primary;
        }
    }
}

.save-card-modal {
    max-width: 850px;
    background: white;
    padding: 25px;
    border-radius: $border-radius;
}
</style>
