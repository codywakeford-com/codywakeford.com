<template>
    <main class="container">
        <header>
            <div class="left">
                <div class="date">{{ dayjs(date).format("dddd, MMMM Do") }}</div>
                <h1 class="project-name">Project Dashboard</h1>
            </div>

            <div class="right">
                <nuxt-link target="_blank" :to="`https://${project.domain}`" class="project-url" v-if="project.domain"
                    >https://{{ project.domain }}</nuxt-link
                >
            </div>
        </header>

        <div class="timeline card">
            <h2>Timeline</h2>
            <dashboard-timeline :project="project" />
        </div>

        <div class="message-log card">
            <h2>Activity Log</h2>
            <dashboard-chatroom />
            <!-- <dashboard-activity-log v-if="project" :project="project" /> -->
        </div>

        <div class="files-container card">
            <h2>Recent Files</h2>

            <div class="files">
                <dashboard-file-card-small
                    v-if="files"
                    class="doc-card"
                    v-for="(file, index) of files"
                    :key="index"
                    :file="file"
                    download
                    :delete="false"
                />
            </div>

            <btn>View All Files</btn>
        </div>

        <div class="meeting card">
            <h2>Meetings</h2>
        </div>

        <div class="action-menu card">
            <h2>Action Menu</h2>
            <dashboard-project-menu v-if="project" :project="project" />
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

main {
    margin-block: 25px;
    max-height: 95%;
    display: grid;
    grid-template-areas:
        "header header header"
        "timeline message-log action-menu"
        "timeline message-log files"
        "meeting message-log files";

    grid-template-rows: auto 8fr 6fr 6fr;
    grid-template-columns: 350px 10fr 300px;

    gap: $gap;

    .timeline {
        grid-area: timeline;
    }

    .message-log {
        grid-area: message-log;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-inline: 0;
        padding-block: 25px 0;

        h2 {
            padding-inline: 25px;
        }
    }

    .files-container {
        display: flex;
        flex-direction: column;
        gap: 5px;

        grid-area: files;

        .files {
            display: flex;
            flex-direction: column;
            gap: 0px;
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
