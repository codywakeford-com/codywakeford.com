<template>
    <div class="container">
        <div class="pattern-background" />
        <div class="dashboard">
            <dashboard-navigation />
            <content>
                <nuxt-page />
            </content>
        </div>
    </div>

    <dashboard-loading-screen v-if="false" />
    <stripe-payment-dialog />
    <dashboard-calendly-modal />
    <upload-file-modal />
    <dashboard-design-modal />
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string
</script>

<style lang="scss" scoped>
.dashboard {
    display: flex;
    height: 100vh;
    width: 100vw;
}

.content {
    max-width: 1800px;
}

.container {
    max-width: 100vw;
    height: 100%;
    overflow: hidden;
}
</style>
