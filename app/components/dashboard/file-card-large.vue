<template>
    <div class="file-card large">
        <Icon name="material-symbols:folder" size="75px" style="color: #ffd662" />
        <div class="name">{{ fileName }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    file: ProjectFile
}>()

const fileName = computed(() => {
    const fileName = props.file.name
    return fileName.length < 15 ? fileName : `${fileName.split("").splice(0, 15).join("")}...`
})
</script>

<style lang="scss" scoped>
@use "~/style/file-card.scss" as *;
</style>
