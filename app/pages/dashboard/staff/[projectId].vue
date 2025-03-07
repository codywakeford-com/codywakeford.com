<template>
    <main class="admin-page">
        <button @click="ProjectController.deleteProject(projectId)">Delete Project</button>
        <nuxt-link :to="`/dashboard/staff/forms/quote?projectId=${projectId}`">Quote</nuxt-link>
    </main>
</template>

<script setup lang="ts">
import ProjectController from "~~/controllers/ProjectsController"

const route = useRoute()
const projectId = route.params.projectId as string

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
    background: white;
    padding: 25px;
}

embed {
    height: 500px;
    width: 325px;
}
</style>
