<template>
    <main class="admin-page">
        <button @click="ProjectController.setDesignDocument(projectId, designLink)">Upload Dummy Figma File</button>
        <button @click="ProjectController.deleteProject(projectId)">Delete Project</button>
        <button
            v-if="$Projects.getByProjectId(projectId).phase === 'development'"
            @click="ProjectController.incrementPhase(projectId)"
        >
            Move to Testing
        </button>

        <button
            v-if="$Projects.getByProjectId(projectId).phase === 'testing'"
            @click="ProjectController.incrementPhase(projectId)"
        >
            Move to Launch
        </button>

        <button
            v-if="$Projects.getByProjectId(projectId).phase === 'launch'"
            @click="ProjectController.incrementPhase(projectId)"
        >
            Move to Live
        </button>
        <nuxt-link :to="`/dashboard/staff/forms/quote?projectId=${projectId}`">Quote</nuxt-link>
    </main>
</template>

<script setup lang="ts">
import ProjectController from "~~/controllers/ProjectsController"
const $Projects = useProjectStore()
const route = useRoute()
const projectId = route.params.projectId as string
const designLink = "https://www.figma.com/design/qqUdjEse9KeWVUQ0svy2jJ/CV-Site?node-id=0-1&t=v2s3QXbpmENRqtiS-1"
definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
}

.quote {
    background: var(--background);
    padding: 25px;
}

embed {
    height: 500px;
    width: 325px;
}
</style>
