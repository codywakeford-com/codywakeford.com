<template>
    <main class="admin-page">
        <!-- <ProjectPhase :phase="project.phase" /> -->

        <btn @click="$Projects.updatePhase(project.id, $Projects.getNextProjectPhase(project.phase))"
            >Go to next stage</btn
        >

        <btn>Request {{ project.phase }} meeting.</btn>
        <btn @click="$Projects.requestMeeting(project.id)">Request General Meeting</btn>

        <button
            @click="
                $Projects.addDesignDocument(
                    projectId,
                    'https://embed.figma.com/design/zsQCMXcnNfevRquVE5JwG1/Gourmai-Mobile?node-id=0-1&embed-host=share'
                )
            "
        >
            add design doc
        </button>
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

        <div class="quote">
            <input type="file" @change="handleFileUpload('quoteDoc', $event)" />
            <input type="file" @change="handleFileUpload('proposalDoc', $event)" />

            <label for="">Amount in £</label>
            <input type="" v-model="totalAmount" />
            <btn @click="uploadQuote(projectId)">Upload Quote</btn>
        </div>
    </main>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string

function handleFileUpload(type: "quoteDoc" | "proposalDoc", event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] || null

    if (type === "quoteDoc") {
        quoteDoc.value = file
    } else if (type === "proposalDoc") {
        proposalDoc.value = file
    }
}

const totalAmount = ref(0)
const proposalDoc = ref<File | null>(null)
const quoteDoc = ref<File | null>(null)

async function uploadQuote(projectId: Project["id"]) {
    if (!proposalDoc.value || !quoteDoc.value) return

    const proposalUrl = await $Files.uploadToFirebase(`/projects/${projectId}/proposal`, proposalDoc.value)
    const quoteUrl = await $Files.uploadToFirebase(`/projects/${projectId}/quote`, quoteDoc.value)

    if (!proposalUrl || !quoteUrl) throw new Error("error getting urls")

    const files: Omit<ProjectFile, "id">[] = [
        {
            name: "ProjectProposal",
            projectId: projectId,
            sender: "codypwakeford@gmail.com",
            timestamp: Date.now(),
            url: proposalUrl,
            type: "document",
        },
        {
            name: "ProjectQuote",
            projectId: projectId,
            sender: "codypwakeford@gmail.com",
            timestamp: Date.now(),
            url: quoteUrl,
            type: "document",
        },
    ]

    const newFiles: ProjectFile[] = []

    for (let i = 0; i < files.length; i++) {
        const id = await createObject<Omit<ProjectFile, "id">>(`/projects/${projectId}/files`, files[i])

        if (!id) return

        newFiles.push({
            id: id,
            ...files[i],
        })
    }

    const quote: ProjectQuote = {
        amountPaid: 0,
        totalAmount: totalAmount.value * 100,
        files: newFiles,
    }

    await updateObject(`/projects/${projectId}`, quote)
}

const project = computed(() => {
    return $Projects.getProjectById(projectId)
})

definePageMeta({
    layout: "dashboard",
    // middleware: "admin-auth",
})
</script>

<style lang="scss" scoped>
.quote {
    background: white;
    padding: 25px;
}
</style>
