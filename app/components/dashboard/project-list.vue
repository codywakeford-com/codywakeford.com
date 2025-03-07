<template>
    <section>
        <header>
            <h1>Projects</h1>
        </header>

        <rflex class="cards">
            <nuxt-link @click="$Projects.state.selectedProjectId = project.id" :to="getProjectUrl(project.id)" class="project-card" v-for="project in $Projects.state.projects">{{ project.id }}</nuxt-link>

            <nuxt-link to="/dashboard/staff/forms/add-project" class="project-add-card">
                <Icon name="material-symbols:add" size="25" style="color: #222" />
            </nuxt-link>
        </rflex>
    </section>
</template>

<script setup lang="ts">
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
    display: flex;
    justify-content: center;

    align-items: center;
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
