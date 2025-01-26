<template>
    <main>
        <dashboard-chatroom />
    </main>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id as string

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})
definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style lang="scss" scoped>
main {
    max-height: 100%;
    position: relative;
}
</style>
