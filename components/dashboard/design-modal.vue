<template>
    <modal id="design-modal">
        <iframe
            style="border: 1px solid rgba(0, 0, 0, 0.1)"
            width="750px"
            height="900px"
            :src="project?.design.url"
            allowfullscreen
        ></iframe>
    </modal>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})

const project = computed(() => {
    return $Projects.getProjectById($Projects.selectedProjectId)
})
</script>

<style lang="scss" scoped></style>
