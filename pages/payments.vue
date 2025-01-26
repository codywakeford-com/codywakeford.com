<template>
    <main>
        <stripe-card
            :options="options"
            :billing-address="billingAddress"
            :metadata="StripeMetadata"
            :onPayment="onPayment"
        />
    </main>
</template>

<script setup lang="ts">
const options: StripePaymentOptions = {
    amount: 1278,
    currency: "gbp",
    receipt_email: "codypwakeford@gmail.com",
}

const StripeMetadata: StripeMetaData = {
    taxRate: 0,
    description: "Web development services.",
}

const billingAddress: BillingAddress = {
    fullName: "",
    addressLine1: "",
    country: "england",
    county: "derbyshire",
    postalCode: "hello",
    city: "hello",
}

const onPayment = () => {
    console.log("hello")
}
</script>

<style lang="scss" scoped>
main {
    padding: 200px 100px;
}
</style>
