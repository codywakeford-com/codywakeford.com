<template>
    <div class="activity-item" v-if="activity">
        <!-- Phase Update -->
        <div class="phase" v-if="activity.type === 'phase'">
            <div class="top">
                <div class="divider" />

                <div class="text" v-if="activity.phaseTo === 'discovery'">Project initiated: Now in the Discovery Phase
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
                    <!-- {{ getFilesForActivity(activity)[0]?.sender }} -->
                </div>

                uploaded
                {{ activity.files.length }} attachments
            </span>
            <span class="attachment-message" v-else>
                <div class="sender">
                    <!-- {{ getFilesForActivity(activity)[0].sender }} -->
                </div>
                uploaded an attachment
            </span>
            <span class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</span>

            <!-- <dashboard-file-card-small  v-for="file in getFilesForActivity(activity)" :key="file.id" :file="file" /> -->
        </div>

        <!-- Action -->
        <!-- <div class="action" v-if="activity.type === 'action'">{{ activity }}</div> -->

        <!-- System Message -->
        <div class="system-message" v-if="activity.type === 'system-message'">
            <rflex>
                <div class="sender">System:</div>
                <div class="messagee">
                    {{ activity.message }}
                </div>
            </rflex>
            <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
            <!-- <div v-for="action in getActivityActions(activity.actions)">
                <button-primary-m v-if="activity.action.type === 'payment'" @click="openModal('paymentModal')">
                    Make Payment
                </button-primary-m>

                <button-primary-m
                    v-if="activity.action.type === 'accept-design'"
                    @click="$Projects.clientAcceptsDesign(props.project.id)"
                >
                    Accept Design
                </button-primary-m>
            </div> -->
        </div>

        <!-- Message -->
        <div class="message" v-if="activity.type === 'activity-message'">
            <rflex class="top">
                <!-- <div class="sender">{{ activity.sender }}</div> -->
                <span>{{ activity.message }}</span>
            </rflex>

            <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>
        </div>

        <!-- Meeting -->
        <div class="meeting" v-if="activity.type === 'meeting'">
            <rflex>
                <div class="sender">{{ activity.sender }}</div>
                <span>has booked a meeting.</span>
            </rflex>
            <div class="timestamp">{{ dayjs(activity.timestamp).format("dddd Do MMM HH:mma") }}</div>

            <div class="meeting-details" v-if="meeting">
                <rflex class="atendees">
                    <Icon width="20" icon="material-symbols:person-outline" />
                    <span>{{ activity.sender }}</span>
                </rflex>
                <rflex class="time">
                    <Icon width="20" icon="uil:calender" />
                    <span>{{ dayjs(meeting.startTime).format("dddd Do MMMM YYYY, HH:mma ") }}</span>
                </rflex>

                <rflex>
                    <Icon width="20" icon="material-symbols:globe" />
                    <span>UK, Ireland, Lisbon Time</span>
                </rflex>

                <rflex class="status">
                    <Icon width="20" icon="gridicons:stats" />
                    <span>{{ meeting.status }}</span>
                </rflex>
            </div>

            <div class="controls">
                <nuxt-link target="_blank" :to="meeting?.meetingUrl">Join Meeting</nuxt-link>
                <nuxt-link target="_blank" :to="meeting?.rescheduleUrl">Reschedule Meeting</nuxt-link>
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
                expected. Please review the proposal and let me
                know if you would like to ammend anything.
            </div>

            <!-- <button-primary-m @click="$Projects.acceptProjectProposal(props.project.id)"
                >Accept Proposal</button-primary-m
            > -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const projectId = useRoute().params.id as string

interface Props {
    activity: ActivityItem
}

const meeting = computed((): Meeting | undefined => {
    if (props.activity.type !== "meeting") return

    return $Meetings.getById(props.activity.meetingId)
})

const files = computed(() => {
    return $Files.getFilesByProjectId(projectId)
})
const getFilesForActivity = (activity: AttachmentActivityItem) => {
    return files.value.filter((file) => activity.files.includes(file.id))
}

const quote = computed(() => {
    return $Projects.quote(projectId)
})

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.activity-item {
    width: 100%;
    padding-block: 15px;

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
        display: flex;
        flex-direction: column;

        .rflex {
            gap: 5px;
        }

        .meeting-details {
            display: flex;
            flex-direction: column;
            background: white;
            margin-top: 10px;
            padding: 10px;
            font-size: 1rem;
            gap: 5px;
            font-size: 0.9rem;
            max-width: min-content;
            border-radius: $border-radius;
            min-width: 300px;

            .rflex {
                font-size: 0.8rem;
                gap: 15px;
            }

            svg {
                color: $text-dark3;
            }

            .status {
                text-transform: capitalize;
            }
        }

        .controls {
            display: flex;
            gap: 10px;
        }

        a {
            margin-top: 10px;
            color: blue;
            font-size: 0.8rem;
        }

        .actions {
            margin-block: 10px;
        }
    }

    .message {
        .rflex {
            gap: 5px;
        }
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
