<template>
    <section>
        <div class="activity-item" v-for="(activity, index) of activityLog.activity">
            <!-- Phase Update -->
            <div class="phase" v-if="activity.type === 'phase'">
                <div class="top">
                    <div class="divider" />

                    <div class="text" v-if="activity.phaseTo === 'discovery'">
                        Project initiated: Now in the Discovery Phase
                    </div>

                    <div class="text" v-else-if="activity.phaseTo === 'live'">Your website is live!</div>

                    <div v-else class="text">Project moved to the {{ activity.phaseTo }} phase!</div>
                    <div class="divider" />
                </div>

                <div class="bottom timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
            </div>

            <!-- Attachment -->
            <div class="attachment" v-if="activity.type === 'attachment'">
                <span class="attachment-message" v-if="activity.files.length > 1">
                    <div class="sender">
                        {{ getFilesForActivity(activity)[0].sender }}
                    </div>

                    uploaded
                    {{ activity.files.length }} attachments
                </span>
                <span class="attachment-message" v-else>
                    <div class="sender">
                        {{ getFilesForActivity(activity)[0].sender }}
                    </div>
                    uploaded an attachment
                </span>
                <span class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</span>

                <dashboard-file-card-small v-for="file in getFilesForActivity(activity)" :key="file.id" :file="file" />
            </div>

            <!-- Action -->
            <div class="action" v-if="activity.type === 'action'">{{ activity.message }}</div>

            <!-- System Message -->
            <div class="system-message" v-if="activity.type === 'system-message'">
                <rflex>
                    <div class="sender">System:</div>
                    <div class="messagee">
                        {{ activity.message }}
                    </div>
                </rflex>
                <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
                <div v-if="activity.action">
                    <button-primary-m v-if="activity.action.type === 'payment'" @click="openModal('paymentModal')">
                        Make Payment
                    </button-primary-m>

                    <button-primary-m
                        v-if="activity.action.type === 'accept-design'"
                        @click="$Projects.clientAcceptsDesign(props.project.id)"
                    >
                        Accept Design
                    </button-primary-m>
                </div>
            </div>

            <!-- Message -->
            <div class="message" v-if="activity.type === 'message'">
                <rflex class="top">
                    <div class="sender">{{ activity.sender }}</div>
                    <span>{{ activity.message }}</span>
                </rflex>

                <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
            </div>

            <!-- Meeting -->
            <div class="meeting" v-if="activity.type === 'meeting'" :class="{ 'show-meeting-details': meetingDetails }">
                <div v-if="activity.update === 'booked'" @click="meetingDetails = !meetingDetails">
                    <rflex>
                        <div class="sender">{{ activity.sender }}</div>
                        <span>has booked a meeting.</span>
                    </rflex>

                    <div class="meeting-details" v-if="meeting">
                        <div class="timestamp">
                            {{ dayjs(meeting.startTime).format("dddd Do MMM HH:mma") }}
                        </div>
                        -
                        <nuxt-link target="_blank" :to="meeting.meetingUrl">Join meeting</nuxt-link>
                    </div>
                </div>

                <div class="expand-icon">
                    <Icon icon="tabler:list-details" />
                </div>

                <div class="meeting-details" v-if="project.meeting">
                    {{ project.meeting }}
                </div>
            </div>

            <!-- Quote -->
            <div class="quote" v-if="activity.type === 'quote'">
                <span>
                    <div class="sender">codypwakeford@gmail.com</div>
                    has uploaded the project proposal
                </span>
                <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>

                <div class="attachments">
                    <dashboard-file-card-small v-if="quote" v-for="file in quote.files" :file="file" />
                </div>

                <div class="system-message">
                    System: This document puts my understanding of the project in writing so we are clear on what is
                    expected. Please review the proposal and let me know if you would like to ammend anything.
                </div>

                <button-primary-m @click="$Projects.acceptProjectProposal(props.project.id)"
                    >Accept Proposal</button-primary-m
                >
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)
const meetingDetails = ref(false)
interface Props {
    project: Project
}

const meeting = computed(() => {
    return $Projects.meeting(props.project.id)
})

const files = computed(() => {
    return $Files.getFilesByProjectId(props.project.id)
})
const getFilesForActivity = (activity: AttachmentActivityItem) => {
    return files.value.filter((file) => activity.files.includes(file.id))
}

const quote = computed(() => {
    return $Projects.quote(props.project.id)
})

const props = defineProps<Props>()

const activityLog: ComputedRef<ActivityLog> = computed(() => {
    return $ActivityLogs.getByProjectId(props.project.id)
})
</script>

<style lang="scss" scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
    width: 100%;
    overflow-y: scroll;
    max-height: 95%;
}
.activity-item {
    width: 100%;
    padding-block: 15px;
    padding-inline: 50px;

    .phase {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .top {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 5px;
            max-height: 20px;

            .divider {
                height: 1px;
                background: $text-light2;
            }

            .text {
                font-size: 0.9rem;
                font-weight: 700;
                white-space: nowrap;
            }
        }
    }

    .attachment,
    .quote {
        display: flex;
        flex-direction: column;

        .attachments {
            display: flex;
        }
        .attachment-message {
            display: flex;
            gap: 5px;
            font-size: 0.9rem;

            .sender {
                font-weight: 700;
                font-size: 0.9rem;
            }
        }
    }

    .quote {
        span {
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .sender {
            font-weight: 700;
            font-size: 0.9rem;
        }
    }

    .meeting {
        .rflex {
            gap: 5px;
        }

        &.show-meeting-details {
        }

        .meeting-details {
            display: flex;
            align-items: center;
            font-size: 1rem;
            gap: 5px;
            font-size: 0.9rem;

            a {
                color: blue;
                font-size: 0.7rem;
            }
        }

        .actions {
            margin-block: 10px;

            button {
            }
        }
    }
    .message {
        .rflex {
            gap: 5px;
        }
    }

    &:hover {
        background: $secondary;
    }
}

.timestamp {
    font-size: 0.8rem;
    font-weight: 500;
}

.sender {
    font-weight: 700;
    font-size: 0.9rem;
}

.system-message {
    display: flex;
    flex-direction: column;
    gap: 2px;
    color: $text-dark3;
    font-size: 0.9rem;
    font-weight: 700;
    margin-block: 5px 10px;

    .timestamp {
        color: black;
    }

    .rflex {
        align-items: flex-start;
        gap: 10px;
    }
}

.btn {
    margin-top: 5px;
    width: min-content;
    white-space: nowrap;
}
</style>
