<template>
    <div class="file-card large">
        <Icon name="material-symbols:folder" size="75px" style="color: #ffd662" />
        <div class="name">{{ file.name }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    file: ProjectFile
}>()
</script>

<style lang="scss" scoped>
@use "@/style/file-card.scss" as *;
</style>
