<template>
    <div class="container">
        <div class="pattern-background dark" />
        <div class="dashboard">
            <dashboard-navigation />
            <content>
                <main>
                    <dashboard-profile-nav />
                    <nuxt-page />
                </main>
            </content>
        </div>
    </div>

    <stripe-payment-modal />
    <dashboard-calendly-modal />
    <dashboard-design-modal />
    <dashboard-files-modal :project-id="projectId" />
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string
</script>

<style scoped lang="scss">
@use "~/style/profile.scss" as *;

.dashboard {
    display: flex;
    height: 100vh;
    width: 100vw;
}

.content {
    max-width: 1400px !important;
}

.container {
    max-width: 100vw;
    height: 100%;
    overflow: hidden;
}
</style>
