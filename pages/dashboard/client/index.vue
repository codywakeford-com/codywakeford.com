<template>
    <main>
        <dashboard-project-list interface="client" v-if="$Projects.state.projects.length" />

        <div class="no-projects-box" v-else>
            <Icon name="ix:project-new" size="50" style="color: grey" />
            <h2>No Projects</h2>
            <p>Feel free to book a call to set one up.</p>

            <button-primary-m @click="ProjectsController.createProject([$User.email])"
                ><Icon name="material-symbols:add-2" style="color: white" size="15" />
                New Project
            </button-primary-m>
        </div>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style scoped lang="scss">
main {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.no-projects-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex: 1;

    h2 {
        margin-top: 15px;
    }

    button {
        display: flex;
        gap: 5px;
        font-weight: 600;
        align-items: center;
        margin-top: 15px;
        min-height: 30px;
        padding-inline: 10px;
    }
}
</style>
