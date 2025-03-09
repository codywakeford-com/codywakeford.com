<template>
    <section class="file-preview card" v-if="previewFile">
        <header class="preview-header">
            <h3>File Preview</h3>
            <Icon name="material-symbols:multimodal-hand-eye" size="25" v-modal="'doc-preview'" />
        </header>
        <embed v-if="previewFile.previewUrl" :src="previewFile.previewUrl" type="application/pdf" />
        <h3 class="file-name">{{ previewFile.name }}.{{ previewFile.extension }}</h3>

        <div class="properties">
            <h4>Properties</h4>
            <div>
                Last Modified:
                {{ dayjs(previewFile.timestamp).format("dddd Do MMM HH:mma") }}
            </div>
            <div v-if="previewFile.size">Size: {{ (previewFile.size / 102400).toFixed(0) }}kb</div>
        </div>
    </section>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const previewFile = computed(() => $FilesDashboard.previewFile)
</script>

<style scoped lang="scss">
.file-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    min-width: 500px;

    header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        padding-bottom: 5px;
    }

    .file-name {
        margin-block: 15px 5px;
    }

    .description {
        font-weight: 300;
        font-size: 0.9rem;
    }

    .properties {
        border-top: 1px solid var(--text2);
        padding-top: 25px;
        margin-top: 25px;

        display: flex;
        flex-direction: column;
        gap: 5px;

        h4 {
            margin-block: 5px;
        }
    }

    embed {
        max-width: 100%;
        min-height: 650px;
        border-bottom: 2px solid black;
        outline: 2px solid black;
        background: var(--secondary);
    }
}
</style>
