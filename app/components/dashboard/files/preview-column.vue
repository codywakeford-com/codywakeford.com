<template>
    <section class="file-preview card" v-if="previewFile">
        <embed :src="previewFile.previewUrl" />

        <div class="card">
            <h3 class="file-name">{{ previewFile.name }}</h3>

            <div class="properties">
                <div class="left">
                    <h4>Name:</h4>
                    <h4>ID:</h4>
                    <h4>Size:</h4>
                    <h4>Uploaded By:</h4>
                    <h4>Mime Type:</h4>
                    <h4>Last Modified:</h4>
                    <h4>Uploaded On:</h4>
                </div>
                <div class="right">
                    <div>{{ $Files.truncateName(previewFile.name, 25) }}</div>
                    <div>{{ previewFile.id }}</div>
                    <div>{{ $Files.formatSize(previewFile.size) }}</div>
                    <div>{{ previewFile.sender }}</div>
                    <div>{{ previewFile.mime }}</div>
                    <div>{{ dayjs(previewFile.lastModified).format("dddd Do MMM HH:mma") }}</div>
                    <div>{{ dayjs(previewFile.timestamp).format("dddd Do MMM HH:mma") }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const previewFile = computed(() => $FilesDashboard.previewFile)
</script>

<style scoped lang="scss">
.file-preview {
    max-width: 500px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    overflow: hidden;
    min-width: 400px;

    .card {
        border-radius: 5px;
        background: var(--text1);
        border: 1px solid var(--text3);
        padding: 25px;
    }

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

        display: grid;
        grid-template-columns: 150px auto;
        flex-direction: column;
        gap: 5px;

        h4 {
            margin-block: 15px;
        }

        div {
            margin-block: 15px;
        }
    }

    embed {
        max-width: 100%;
        border: none;
        min-height: 650px;
        border-bottom: 3px solid black;
        background: var(--secondary);
    }
}
</style>
