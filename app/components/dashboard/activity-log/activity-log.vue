<template>
    <section class="activity-log">
        <div class="messages-container" ref="messagesContainer">
            <div v-for="(item, index) of $ActivityLogs.getByProjectId(projectId)" :key="index">
                <dashboard-message v-if="item.type === 'message'" :message="item" />
                <dashboard-activity-message v-else :activity="item" />
            </div>
        </div>

        <dashboard-activity-log-input />
    </section>
</template>

<script setup lang="ts">
const projectId = useRoute().params.id as string
const messagesContainer = ref<HTMLElement | null>(null)

watch($ActivityLogs.state.log, () => {
    setTimeout(() => {
        scrollToBottom()
    }, 0)
})

function scrollToBottom() {
    const container = messagesContainer.value
    if (container) {
        const lastMessage = container.lastElementChild

        if (lastMessage) {
            container.scrollTop = container.scrollHeight
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    background: var(--background);
}

.no-messages {
    position: absolute;
    top: 25px;
    color: var(--text3);
    left: 50%;
    transform: translateX(-50%);
}

.activity-log {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    .messages-container {
        border-bottom: 2px solid var(--secondary);
        overflow-x: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-inline: 35px;
        padding-block: 25px 50px;
        scroll-behavior: smooth;
        max-height: calc(100vh - 310px);
        gap: 25px;
    }
}
</style>
