<template>
    <main class="container" :class="{ 'actions-active': $Actions.getPendingByProjectId(projectId).length > 0 }">
        <header>
            <div class="left">
                <div class="date">{{ dayjs(date).format("dddd, MMMM Do") }}</div>
                <h1 class="project-name">Project Dashboard</h1>
            </div>

            <div class="right">
                <dashboard-client-project-controls />
                <dashboard-staff-project-controls v-if="$User.state.user.role === 'staff'" />
                <!-- <nuxt-link target="_blank" :to="`https://${project.domain}`" class="project-url" v-if="project?.domain">https://{{ project?.domain }}</nuxt-link> -->
            </div>
        </header>

        <div class="page-content">
            <div class="left-content">
                <div class="timeline card">
                    <h3>Timeline</h3>
                    <dashboard-timeline :project="project" />
                </div>

                <div class="meeting card">
                    <dashboard-meetings v-if="$Meetings.getByProjectId(projectId).length" />

                    <div class="no-meetings-message" v-else>
                        <h3>Meetings</h3>
                        <p>You have no meetings booked for this project at the moment.</p>
                    </div>
                </div>
            </div>

            <div class="center-content">
                <div class="message-log card">
                    <h3>Project Log</h3>
                    <p>A place to find all activity associated with this project.</p>

                    <dashboard-activity-log />
                </div>
            </div>

            <div class="right-content">
                <div class="action-menu card">
                    <dashboard-action
                        :project="project"
                        v-if="$Actions.getPendingByProjectId(projectId).length && project"
                    />
                    <div class="no-actions-message" v-else>
                        <h3>Actions</h3>
                        <p>Nothing to do at the moment!</p>
                    </div>
                </div>

                <div class="files-container">
                    <div class="files-card card">
                        <header>
                            <Icon name="material-symbols:clock-loader-10" size="25px" />
                            <h3>Recent Files</h3>
                        </header>

                        <div class="files">
                            <span v-if="!files.length">No files uploaded to this project</span>
                            <dashboard-file-card v-else v-for="(file, index) of files" :key="index" :file="file" />
                        </div>
                    </div>

                    <div class="files-actions">
                        <nuxt-link to="/dashboard/client/documents">
                            <button-primary-m>View All Files</button-primary-m>
                        </nuxt-link>

                        <button-primary-m @click="openModal('files-modal')">Upload a File</button-primary-m>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <dashboard-files-modal :project-id="projectId" />
</template>

<script setup lang="ts">
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
    return $Projects.getByProjectId(projectId)
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
    padding-block: 25px 25px;

    height: 100vh;
    display: flex;
    flex-direction: column;

    .page-content {
        display: flex;
        flex-grow: 1;
        height: 90%;

        max-height: 100%;
        gap: $gap;
    }

    .right-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: $gap;
        width: 350px;
        min-width: 350px;
        max-width: 350px;

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
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .files-card {
                display: flex;
                flex-direction: column;
                flex: 1;

                gap: 15px;

                span {
                    font-size: 0.9rem;
                    color: var(--text3);
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

                a,
                button {
                    flex-grow: 1;
                    width: 100%;
                    height: 100%;
                    min-height: 40px;
                }
            }
        }
    }

    .left-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
        max-height: 100%;
        width: 350px;
        max-width: 400px;
        gap: $gap;

        .timeline {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            overflow: hidden;
            flex: 1;
            min-width: 350px;
            padding-inline: 0;
            padding-block: 25px 0;

            h3 {
                padding-inline: 25px;
                padding-bottom: 25px;
            }
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
        flex-grow: 1;

        .message-log {
            grid-area: message-log;
            display: flex;
            height: 100%;
            max-height: 100%;
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

            p {
                padding-block: 5px 25px;
                font-size: 0.9rem;
                padding-inline: 25px;

                border-bottom: 1px solid var(--text2);
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
    padding-bottom: 25px;

    grid-area: header;

    .right {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}

.card {
    background: var(--background);
    padding: 25px;
    border-radius: $border-radius;
    box-shadow: 3px 3px 20px var(--shadow-color);
}
</style>
