<template>
    <main>
        <div class="main-left">
            <header>
                <h1>Files</h1>
                <dashboard-files-search />
            </header>

            <section class="recent-section">
                <header class="sub-header">
                    <h2>Recent Files</h2>
                </header>

                <div class="cards">
                    <dashboard-file-card-large
                        v-for="(file, index) of $Files.getRecent(4)"
                        @click="selectedDoc = file.previewUrl"
                        :key="index"
                        :file="file"
                    />
                </div>
            </section>

            <div class="files-section">
                <div class="files-table-box">
                    <header class="sub-header">
                        <h2>All Files</h2>
                    </header>

                    <section>
                        <div class="cards">
                            <dashboard-file-card
                                @click="$FilesDashboard.state.previewFileIndex = index"
                                v-for="(file, index) of $Files.state.files"
                                :file="file"
                                :key="index"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <dashboard-files-preview-column />
    </main>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const $Files = useFileStore()
const $FilesDashboard = useFilesDashboardStore()

const selectedDoc = ref("")

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style lang="scss" scoped>
main {
    display: flex;
    gap: 50px;
    height: 100vh;
    padding-block: 25px;

    .main-left {
        display: flex;
        flex-direction: column;
        gap: 25px;
        flex-grow: 1;
        overflow-y: auto;
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
    }
}

.sub-header {
    margin-block: 15px;
}

.search-section {
    display: flex;

    gap: 10px;
}

.cards {
    display: flex;

    align-items: start;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 25px;
}

header {
    display: flex;
    justify-content: space-between;

    h1 {
        font-weight: bold;
    }
}

.files-section {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
