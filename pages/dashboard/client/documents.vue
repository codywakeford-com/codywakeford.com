<template>
    <main>
        <section class="recent-section">
            <header>

                <h2>Recent Files</h2>

            </header>
            <rflex class="cards" v-if="files.length">
                <div v-if="!files">Here you will find all project related documents. Check back once the project is
                    under way!</div>
                <dashboard-file-card @click="selectedDoc = file.url" v-for="(file, index) of files" :key="index"
                    :file="file" :delete="false" :download="true" />
            </rflex>
        </section>

        <div class="files-section">
            <header>
                <h2>All Files</h2>
                <section class="search-section">
                    <input type="text" v-model="filters.search" />
                    <select name="" id="" v-model="filters.type">
                        <option value="any">Any</option>
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                    </select>
                </section>
            </header>

            <div class="grid-row" :class="{ 'show-preview': previewFile }">

                <div class="cards card">
                    <dashboard-file-card-small class="file-card" v-for="(file, index) of files" :key="index"
                        :file="file" @click="previewFile = file" />
                </div>

                <section class="file-preview card" v-if="previewFile">
                    <h3>File Preview</h3>
                    <embed :src="previewFile.url" type="application/pdf">
                    <div class="file-name">{{ previewFile.name }}</div>

                    <div class="description">
                        <p>{{ previewFile.description }}</p>
                        <p v-if="!previewFile.description">No description provided</p>
                    </div>

                    <div class="properties">
                        <h3>Properties</h3>
                        <div>Type: {{ previewFile.type }}</div>
                        <div v-if="previewFile.size">Size: {{ previewFile.size }}</div>
                        <div>Last Modified: {{ previewFile.timestamp }}</div>
                        <div>Size: {{ previewFile.size }} </div>
                    </div>

                    <pre>{{ previewFile }} </pre>
                </section>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
// import { Icon } from "@iconify/vue"
const previewFile = ref<ProjectFile | null>(null)
const filters: Ref<FileFilters> = ref({
    search: "",
    type: "any",
})

const files = computed(() => {
    return $Files.filterFiles(filters.value)
})

const selectedDoc = ref("")

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style lang="scss" scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 25px;

    height: 100vh;
    background: $text-light1;

    padding: 25px;

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        // margin-bottom:
    }
}

.cards {
    align-items: start;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 25px;
}

header {
    display: flex;
    justify-content: space-between;



}

.card {
    border-radius: $border-radius;
    background: white;
}

.files-section {
    display: flex;
    flex-direction: column;

    .file-card {
        cursor: pointer;
    }

    .grid-row {
        display: grid;
        grid-template-columns: 5fr;
        grid-gap: 25px;
        width: 100%;
        transition: all 0.15s;

        &.show-preview {
            grid-template-columns: 4fr 1fr;
        }

        .cards {}

        .file-preview {
            overflow: hidden;
        }
    }
}
</style>
