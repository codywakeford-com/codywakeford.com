<template>
    <section>
        <header>
            <h1>Projects</h1>
        </header>

        <rflex class="cards">
            <anchor
                :to="getProjectUrl(project.id)"
                class="project-card"
                v-for="project in projects"
                @click="$Projects.selectedProjectId = project.id"
            >
                <h3>{{ project.name }}</h3>
                <!-- <p>{{ project.companyName }}</p> -->
                <p class="project-domain">{{ project?.domain }}</p>
                <p class="project-description">{{ project?.description }}</p>

                <div v-if="project.action">Action: {{ project.action }}</div>
                <div class="project-phase">{{ project.phase }}</div>
            </anchor>

            <mflex @click="openModal('createProject')" v-if="props.interface === 'staff'" class="project-add-card">
                <Icon icon="material-symbols:add" width="25" color="#222" />
            </mflex>
        </rflex>

        <modal id="createProject">
            <form @submit.prevent="$Projects.create(projectDetails)" class="create-project-form">
                <div class="form-group">
                    <label for="name">Project Name:</label>
                    <input type="text" id="name" name="name" v-model="projectDetails.name" />
                </div>
                <div class="form-group">
                    <label for="emails">Emails:</label>
                    <input type="text" id="emails" name="emails" v-model="projectDetails.emails" />
                </div>
                <btn type="submit" class="submit-btn">Create Project</btn>
            </form>
        </modal>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

const projects = computed(() => {
    return $Projects.getByEmail($User.email)
})
const projectDetails: Ref<Omit<Project, "id">> = ref({
    name: "",
    emails: [""],
    phase: "discovery",
    paymentPlan: "noneSelected",
    companyName: "Random Company",
})

interface Props {
    interface: "staff" | "client"
}

const props = defineProps<Props>()

function getProjectUrl(projectId: string) {
    if (props.interface === "staff") {
        return `/dashboard/staff/${projectId}`
    } else {
        return `/dashboard/client/${projectId}`
    }
}
</script>

<style lang="scss" scoped>
header {
    margin-bottom: 25px;

    h1 {
        font-size: 2rem;
        font-weight: 600;
    }
}

.cards {
    align-items: start;
    gap: 50px;
    flex-wrap: wrap;
}

.project-add-card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 300px;
    min-height: 300px;
}
.project-card {
    display: flex;
    flex-direction: column;
    align-items: start;
    position: relative;
    background: white;
    min-width: 250px;
    flex-grow: 1;
    border-radius: 10px;
    box-shadow: 4px 4px 10px black;
    min-height: 300px;
    padding: 20px;
    max-width: 300px;

    h3 {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .project-phase {
        position: absolute;
        bottom: 20px;
        right: 0;
        color: #333;
        font-size: 0.9rem;
        padding: 2px 10px 2px 15px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        background: lightgreen;
    }
    .project-description {
        color: #555;
        flex-grow: 1;
        font-size: 1rem;
    }

    .project-domain {
        font-weight: 100;
        color: #222;
        font-size: 0.9rem;
        margin-bottom: 10px;
    }
}
</style>
