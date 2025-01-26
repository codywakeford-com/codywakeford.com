<template>
    <main class="admin-page">
        <!-- <ProjectPhase :phase="project.phase" /> -->

        <btn
            @click="$Projects.updatePhase(project.id, $Projects.getNextProjectPhase(project.phase))"
            >Go to next stage</btn
        >

        <btn>Request {{ project.phase }} meeting.</btn>
        <btn @click="$Projects.requestMeeting(project.id)">Request General Meeting</btn>
        <btn @click="$Projects.delete(project.id), navigateTo('/admin/clients')"
            >Delete Project</btn
        >
        <btn @click="$Projects.addProjectDocument(projectId, document)">Add document</btn>

        <!-- Meeting Link when generated -->
        <cflex v-if="project.meeting">
            <h4>Booked meeting link</h4>
            <p>
                Meeting Link:
                <anchor target="_blank" :to="project.meeting?.meetingUrl" class="meeting-link">
                    Google Meet Link</anchor
                >
            </p>
            Start time: {{ new Date(project.meeting.startTime).toLocaleString() }}

            <pre>
                {{ project.meeting }}
            </pre>
        </cflex>

        <GenerateQuote :project="project" />
    </main>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string
const document: ProjectFile = {
    name: "Doc",
    extension: ".pdf",
    signed: false,
    url: "https://pdfobject.com/pdf/sample.pdf",
}
const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

definePageMeta({
    layout: "dashboard",
    // middleware: "admin-auth",
})
</script>

<style lang="sass" scoped></style>
