<template>
    <modal id="design-modal">
        <iframe style="border: 1px solid rgba(0, 0, 0, 0.1)" width="750px" height="900px" :src="designUrl" allowfullscreen></iframe>
    </modal>
</template>

<script setup lang="ts">
const designUrl = computed(() => {
    return $Projects.designUrl($Projects?.state.selectedProjectId)
})
</script>

<style lang="scss" scoped></style>
