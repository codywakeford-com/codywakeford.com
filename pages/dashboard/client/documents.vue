<template>
    <main>
        <!-- <header>
            <h1>Project Files</h1>
        </header> -->

        <section class="search-section">
            <input type="text" v-model="filters.search" />
            <select name="" id="" v-model="filters.type">
                <option value="any">Any</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
            </select>
        </section>

        <section class="recent-section">
            <h2>Recent Files</h2>
        </section>

        <section class="files-section">
            <rflex class="cards" v-if="files.length">
                <div v-if="!files">Here you will find all project related documents. Check back once the project is under way!</div>
                <dashboard-file-card
                    @click="selectedDoc = file.url"
                    v-for="(file, index) of files"
                    :key="index"
                    :file="file"
                    :delete="false"
                    :download="true"
                />
            </rflex>
        </section>
    </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

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
</style>
