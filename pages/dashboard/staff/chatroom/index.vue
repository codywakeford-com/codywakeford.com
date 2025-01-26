// ChatPage.vue
<template>
    <main class="chat-page">
        <aside class="chat-sidebar">
            <h2 class="sidebar-title">Project Chatrooms</h2>
            <div class="chatroom-list">
                <button
                    v-for="project in $Projects.get"
                    :key="project.id"
                    @click="selectChatroom(project)"
                    :class="['chatroom-btn', { active: activeChatroomId === project.id }]"
                >
                    <span class="project-name">{{ project.name }}</span>
                    <span v-if="unreadCounts[project.id]" class="unread-badge">
                        {{ unreadCounts[project.id] }}
                    </span>
                </button>
            </div>
        </aside>

        <section class="chat-main">
            <div v-if="!activeChatroomId" class="no-chat-selected">
                <h5>Select a project chatroom to start messaging</h5>
            </div>

            <Chatroom v-else :chatroom-id="activeChatroomId" :project-name="activeProject?.name" />
        </section>
    </main>
</template>

<script setup lang="ts">
const activeChatroomId = ref("")
const activeProject = ref(null)
const unreadCounts = ref<Record<string, number>>({})
const notificationPermission = ref<NotificationState>("default")

// Request notification permission on mount
onMounted(async () => {
    if ("Notification" in window) {
        notificationPermission.value = await Notification.requestPermission()
    }
})

function selectChatroom(project: any) {
    activeChatroomId.value = project.id
    activeProject.value = project
    // Reset unread count when selecting chatroom
    unreadCounts.value[project.id] = 0
}

definePageMeta({
    layout: "dashboard",
    middleware: "admin-auth",
})
</script>

<style lang="scss" scoped>
.chat-page {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 1rem;
    height: 100vh;
    padding: 1rem;
}

.chat-sidebar {
    border-right: 1px solid #e2e8f0;
    padding-right: 1rem;
}

.sidebar-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.chatroom-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.chatroom-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f8fafc;
    }

    &.active {
        background: #e0e7ff;
        border-color: #818cf8;
    }
}

.unread-badge {
    background: #ef4444;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
}

.chat-main {
    height: 100%;
}

.no-chat-selected {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
}
</style>
