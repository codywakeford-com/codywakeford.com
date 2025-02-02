<template>
    <div class="attachment-item">
        <Icon class="icon" icon="ph:file-pdf-bold" width="30" v-if="file.name.includes('pdf')" color="darkblue" />
        <Icon class="icon" icon="ph:file-doc-bold" width="30" v-else-if="file.name.includes('doc')" />
        <Icon class="icon" icon="mdi:document" width="30" v-else />

        <div class="right">
            <div class="name">{{ file.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

interface Props {
    file: ProjectFile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.attachment-item {
    margin-block: 10px;
    display: flex;
    border: 1px solid $text-dark3;
    width: min-content;
    gap: 5px;
    align-items: center;
    padding: 5px;
    border-radius: 10px;
    min-width: 250px;

    .icon {
        border: 1px solid $primary;
        border-radius: 5px;
        padding: 5px;
    }

    .name {
        white-space: nowrap;
    }
}
</style>
