<template>
    <main class="container">
        <header>
            <div class="left">
                <div class="date">Mon, July 8</div>
                <h1 class="project-name">{{ project?.name }}</h1>
            </div>

            <div class="right">
                <div class="project-url">{{ project?.domain }}</div>
                <!-- <button @click="$ActivityLogs.(projectId, phaseActivityItem)">add phase</button> -->
                <!-- <button @click="$ActivityLogs.addFilesActivityItem(projectId, )">add file</button> -->
                <!-- <button @click="$ActivityLogs.create(projectId, actionActivityItem)">Meeting Scheduled</button> -->

                <!-- <button @click="$ActivityLogs.addFilesActivityItem(projectId, ['9rRbFsHxQ3L6W9GCFzRU'])">
                    
                </button> -->

                <button @click="$Projects.incrementPhase(projectId)">go to next phase</button>
                <button v-if="!project?.quote" @click="$Projects.addDummyQuote(projectId)">Upload quote</button>
            </div>
        </header>

        <div class="timeline card">
            <h2>Timeline</h2>
            <dashboard-timeline :project="project" />
        </div>

        <div class="activity-log card">
            <h2>Activity Log</h2>
            <dashboard-activity-log v-if="project" :project="project" />
        </div>

        <div class="files-container card">
            <h2>Files</h2>

            <div class="files">
                <dashboard-file-card
                    v-if="files"
                    class="doc-card"
                    v-for="(file, index) of files"
                    :key="index"
                    :file="file"
                    download
                    :delete="false"
                />
            </div>
        </div>

        <div class="action-required card">
            <h2>Actions Required</h2>
        </div>

        <div class="action-menu card">
            <h2>Action Menu</h2>
            <dashboard-project-menu v-if="project" :project="project" />
        </div>
    </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const route = useRoute()
const projectId = route.params.id as string

const files = computed(() => {
    return $Files.get
})

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style lang="scss" scoped>
$gap: 15px;

main {
    margin-block: 25px;
    max-height: 95%;
    display: grid;
    grid-template-areas:
        "header header header"
        "timeline activity-log action-menu"
        "timeline activity-log actions-required"
        "timeline files files";

    grid-template-rows: auto 10fr 6fr 4fr;
    grid-template-columns: 5fr 10fr 3fr;

    gap: $gap;

    .timeline {
        grid-area: timeline;
    }

    .activity-log {
        grid-area: activity-log;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-inline: 0;

        h2 {
            padding-inline: 25px;
        }
    }

    .files-container {
        display: flex;
        flex-direction: column;
        gap: 15px;

        grid-area: files;

        .files {
            display: flex;
            gap: 10px;
        }
    }

    .right-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: $gap;

        .rflex {
            gap: $gap;
            flex: 1;

            div {
                min-height: 700px;
                flex: 1;
            }
        }
        .file {
            width: 100%;
        }
    }
}
header {
    grid-area: header;
}

header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}
.timeline {
    display: flex;
    flex-direction: column;
    gap: 35px;
}
.card {
    background: white;
    padding: 25px;
    border-radius: $border-radius;
    box-shadow: 3px 3px 20px lightgrey;
}
.actions-required {
    grid-area: actions-required;
}
.action-menu {
    display: flex;
    flex-direction: column;
    gap: 20px;
    grid-area: action-menu;
    padding-inline: 0;

    h2 {
        padding-inline: 25px;
    }
}
</style>
