<template>
    <div class="card" v-if="file.name">
        <Icon class="icon" name="ph:file-pdf-bold" size="30" v-if="file.name.includes('pdf')" color="darkblue" />
        <Icon class="icon" name="ph:file-doc-bold" size="30" v-else-if="file.name.includes('doc')" />
        <Icon class="icon" name="mdi:document" size="30" v-else />

        <div class="right">
            <div class="name">{{ file.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    file: ProjectFile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.card {
    margin-block: 10px;
    display: flex;
    border: 1px solid var(--text2);
    width: min-content;
    gap: 5px;
    align-items: center;
    padding: 5px;
    border-radius: 3px;
    min-width: 250px;

    .name {
        font-weight: bold;
        white-space: nowrap;
    }
}
</style>
