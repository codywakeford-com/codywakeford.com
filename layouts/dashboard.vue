<template>
    <div class="container">
        <div class="pattern-background" />
        <div class="dashboard">
            <dashboard-navigation />
            <content class="content">
                <nuxt-page />
            </content>
        </div>
    </div>

    <dashboard-loading-screen v-if="false" />
    <stripe-payment-modal />
    <stripe-save-card-modal />
    <dashboard-design-modal />
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string
</script>

<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100%;
}

.content {
    max-height: 100vh;
    max-width: $dashboard-page-width;
    padding-inline: var(--page-gutter-sm);
    position: relative;
    z-index: 2;
    overflow: none;
}

.container {
    max-width: 100vw;
    height: 100%;
    overflow: hidden;
}
</style>
