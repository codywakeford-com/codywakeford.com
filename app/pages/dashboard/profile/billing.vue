<template>
    <section class="profile-page">
        <header>
            <h1>Billing Details</h1>
            <p>
                Your billing information is securely stored and can be updated at any time. Please ensure your details
                are accurate to avoid any service interruptions.
            </p>
        </header>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard-profile",
    middleware: "dashboard",
})
</script>

<style scoped lang="scss"></style>
