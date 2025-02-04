<template>
    <div class="container">
        <div class="pattern-background light" />
        <div class="dashboard">
            <dashboard-navigation />
            <nuxt-page />
        </div>
    </div>

    <dashboard-loading-screen v-if="false" />
    <stripe-payment-modal />
    <stripe-save-card-modal />
    <dashboard-design-modal />
</template>

<script setup lang="ts">
const route = useRoute();
const projectId = route.params.projectId as string;
</script>

<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100vh;
    width: 100vw;
}

.container {
    max-width: 100vw;
    height: 100%;
    overflow: hidden;
}
</style>
