<template>
    <main class="container" :class="{ 'actions-active': actions.length > 0 }">
        <header>
            <div class="left">
                <div class="date">{{ dayjs(date).format("dddd, MMMM Do") }}</div>
                <h1 class="project-name">Project Dashboard</h1>
            </div>

            <div class="right">
                <nuxt-link target="_blank" :to="`https://${project.domain}`" class="project-url"
                    v-if="project?.domain">https://{{ project?.domain }}</nuxt-link>
            </div>
        </header>

        <div class="timeline card">
            <dashboard-timeline :project="project" />
        </div>

        <div class="message-log card">
            <h3>Activity Log</h3>
            <dashboard-chatroom />
            <!-- <dashboard-activity-log v-if="project" :project="project" /> -->
        </div>

        <div class="files-container">
            <div class="files-card card">
                <h3>Recent Files</h3>

                <div class="files">
                    <span v-if="!files.length">No files uploaded to this project</span>
                    <dashboard-file-card-small class="doc-card" v-else v-for="(file, index) of files" :key="index"
                        :file="file" />
                </div>
            </div>
            <div class="files-actions">
                <button-primary-m to="/dashboard/client/documents">View All Files</button-primary-m>
                <button-primary-m>Upload a File</button-primary-m>
            </div>
        </div>

        <div class="meeting card">
            <dashboard-meetings />
        </div>

        <div class="action-menu card">
            <dashboard-action v-if="project" :project="project" />
        </div>
    </main>
    <stripe-payment-modal :project-id="projectId" />
</template>

<script setup lang="ts">
import { DashboardChatroom } from "#components"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend(advancedFormat)

const date = computed(() => {
    let date = Date.now()

    setTimeout(() => {
        date = Date.now()
    }, 1000 * 1800) // 30 mins

    return date
})

const actions = computed(() => {
    return $Actions.getPendingByProjectId(projectId)
})

const route = useRoute()
const projectId = route.params.id as string

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

const files = computed(() => {
    return $Files.getRecent(5)
})

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style lang="scss" scoped>
$gap: 15px;

.container {
    padding-block: 25px;
    height: 100vh;
    display: grid;
    grid-template-areas:
        "header header header"
        "timeline message-log files"
        "timeline message-log files"
        "meeting message-log files";

    grid-template-rows: auto auto 8fr auto;
    grid-template-columns: 350px 10fr 300px;

    gap: $gap;

    .action-menu {}

    &.actions-active {
        grid-template-areas:
            "header header header"
            "timeline message-log action-menu"
            "timeline message-log files"
            "meeting message-log files";

        .action-menu {
            display: flex;
        }
    }

    .timeline {
        grid-area: timeline;
        padding: 0px;
    }

    .message-log {
        grid-area: message-log;
        display: flex;
        height: 100%;
        flex-direction: column;
        padding-inline: 0;
        overflow: none;
        flex: 1;
        padding-block: 0;

        h3 {
            padding-top: 25px;
            padding-inline: 25px;
        }
    }

    .files-container {
        display: flex;
        height: 100%;
        flex-direction: column;
        gap: 10px;

        grid-area: files;

        .files-card {
            display: flex;
            flex-direction: column;
            flex: 1;

            gap: 15px;

            span {
                font-size: 0.9rem;
                color: $text-light3;
            }
        }

        .files-actions {
            display: flex;
            gap: 10px;

            button {
                flex-grow: 1;
                min-height: 40px;
            }
        }
    }

    .meeting {
        grid-area: meeting;
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
</style>
