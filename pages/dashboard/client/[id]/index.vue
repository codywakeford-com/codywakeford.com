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

        <div class="page-content">
            <div class="left-content">
                <div class="timeline card">
                    <!-- <dashboard-timeline :project="project" /> -->
                </div>

                <div class="meeting card">
                    <dashboard-meetings v-if="$Meetings.getLengthByProjectId(projectId)" />

                    <div class="no-meetings-message" v-else>
                        <h3>Meetings</h3>
                        <p>You have no meetings booked for this project at the moment.</p>
                    </div>
                </div>
            </div>

            <div class="center-content">
                <div class="message-log card">
                    <h3>Activity Log</h3>
                    <dashboard-chatroom />
                    <!-- <dashboard-activity-log v-if="project" :project="project" /> -->
                </div>
            </div>

            <div class="right-content">
                <div class="action-menu card">
                    <dashboard-action :project="project" v-if="actions.length && project" />
                    <div class="no-actions-message" v-else>
                        <h3>Actions</h3>
                        <p>Nothing to do at the moment!</p>
                    </div>
                </div>

                <div class="files-container">
                    <div class="files-card card">
                        <header>
                            <Icon icon="material-symbols:clock-loader-10" width="25px" />
                            <h3>Recent Files</h3>
                        </header>

                        <div class="files">
                            <span v-if="!files.length">No files uploaded to this project</span>
                            <div class="file" v-else v-for="(file, index) of files" :key="index" :file="file">
                                <Icon icon="material-symbols:docs-outline" width="25px" />
                                <div class="name">{{ file.name }}.{{ file.extension }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="files-actions">
                        <nuxt-link to="/dashboard/client/documents">
                            <button-primary-m>View All Files</button-primary-m>
                        </nuxt-link>

                        <nuxt-link>
                            <button-primary-m>Upload a File</button-primary-m>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <stripe-payment-modal :project-id="projectId" />
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { DashboardChatroom } from "#components";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const date = computed(() => {
    let date = Date.now();

    setTimeout(() => {
        date = Date.now();
    }, 1000 * 1800); // 30 mins

    return date;
});

const actions = computed(() => {
    return $Actions.getPendingByProjectId(projectId);
});

const route = useRoute();
const projectId = route.params.id as string;

const project = computed(() => {
    return $Projects.getProjectById(projectId);
});

const files = computed(() => {
    return $Files.getRecent(5);
});

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
});
</script>

<style lang="scss" scoped>
$gap: 15px;

main {
    overflow: auto;
    padding-block: 25px;
    height: 100vh;
    display: flex;
    gap: $gap;
    flex-direction: column;

    .page-content {
        display: grid;
        flex-grow: 1;

        gap: $gap;
        grid-template-columns: 350px auto 350px;
        box-sizing: border-box;
    }

    .right-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-height: 100%;
        gap: $gap;

        .no-actions-message {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .files-container {
            display: flex;
            height: 100%;
            flex-direction: column;
            gap: 10px;

            grid-area: files;

            .files {
                .file {
                    display: flex;
                    align-items: flex-end;
                    padding-block: 15px 20px;
                    gap: 10px;
                    border-bottom: 1px solid $text-light3;

                    &:hover {
                        background: $text-light1;
                    }
                }
            }

            .files-card {
                display: flex;
                flex-direction: column;
                flex: 1;

                gap: 15px;

                span {
                    font-size: 0.9rem;
                    color: $text-light3;
                }

                header {
                    display: flex;
                    justify-content: flex-start;
                    gap: 5px;
                }
            }

            .files-actions {
                display: flex;
                gap: 10px;

                a {
                    flex-grow: 1;
                    width: 100%;
                    height: 100%;
                    min-height: 40px;

                    button {
                        flex: 1;
                        height: 100%;
                        width: 100%;
                    }
                }
            }
        }
    }

    .left-content {
        display: flex;
        flex-direction: column;
        gap: $gap;

        .timeline {
            position: relative;
            grid-area: timeline;
            overflow: hidden;
            padding: 0px;
            height: 500px;
            width: 100%;
            flex: 1;
        }

        .meeting {
            grid-area: meeting;

            .no-meetings-message {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
        }
    }

    .center-content {
        height: 100%;

        .message-log {
            grid-area: message-log;
            display: flex;
            height: 100%;
            flex-direction: column;
            padding-inline: 0;
            overflow: none;
            flex: 1;
            padding-inline: 0;
            padding-block: 0;

            h3 {
                padding-top: 25px;
                padding-inline: 25px;
            }
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
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    grid-area: header;
}

.card {
    background: white;
    padding: 25px;
    border-radius: $border-radius;
    box-shadow: 3px 3px 20px lightgrey;
}
</style>
