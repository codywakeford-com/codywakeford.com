<template>
    <header>
        <h1>Project Documents</h1>
    </header>
    <rflex class="cards">
        <div v-if="!project.documents.length">
            Here you will find all project related documents. Check back once the project is under
            way.
        </div>
        <btn
            modal="pdfModal"
            class="document"
            v-for="document in project.documents"
            @click.stop="selectedDoc = document.url"
        >
            <Icon icon="ic:baseline-insert-drive-file" width="50" color="#777" />
            <div>{{ document.name }}</div>

            <a @click.stop.prevent class="download" :href="document.url" :download="document.name">
                <Icon icon="ic:round-file-download" width="20" />
                <!-- <Icon icon="ic:baseline-file-download-done" width="20" /> -->
            </a>
        </btn>
    </rflex>

    <modal id="pdfModal">
        <embed :src="selectedDoc" type="application/pdf" width="900px" height="1200px" />
    </modal>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const route = useRoute()
const projectId = route.params.id as string

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

const selectedDoc = ref("")
</script>

<style lang="sass" scoped>
header
    margin-block: 0px 20px

    h1
        font-size: 2rem
        font-weight: bold
.cards
    align-items: start
    gap: 25px
.document
    position: relative
    display: flex
    flex-direction: column
    align-items: center
    padding: 25px 25px 35px 25px
    gap: 10px
    border: none
    background: white
    border-radius: 5px
    width: 150px

    .download
        position: absolute
        bottom: 5px
        right: 5px
        padding: 2px
        border-radius: 3px
        &:hover
            background: rgba(0, 0, 0, 0.1)
</style>
