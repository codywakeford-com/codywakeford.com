<template>
    <modal id="design-modal">
        <iframe
            style="border: 1px solid rgba(0, 0, 0, 0.1)"
            width="750px"
            height="900px"
            src="https://embed.figma.com/design/zsQCMXcnNfevRquVE5JwG1/Gourmai-Mobile?node-id=0-1&embed-host=share"
            allowfullscreen
        ></iframe>
    </modal>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
const embedLink = "https://embed.figma.com/design/zsQCMXcnNfevRquVE5JwG1/Gourmai-Mobile?node-id=0-1&embed-host=share"
const project = computed(() => {
    return $Projects.getProjectById($Projects.selectedProjectId)
})
</script>

<style lang="scss" scoped></style>
