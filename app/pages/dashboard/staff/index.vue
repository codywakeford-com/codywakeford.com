<template>
    <mpage>
        <section class="main-content">
            <nav>
                <div class="left">
                    <img src="/assets/cw-logo.webp" alt="logo" />
                </div>

                <div class="right">
                    <nuxt-link to="/dashboard/staff/forms/add-project">Create New Project</nuxt-link>
                    <nuxt-link to="/dashboard/staff/forms/quote">Create Quote</nuxt-link>
                </div>
            </nav>

            <h2>Ongoing Projects</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Phase</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(project, index) of $Projects.state.projects" :key="index" @click="navigateTo(`/dashboard/staff/${project.id}`)">
                        <td>{{ project.id }}</td>
                        <td>{{ project.phase }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="action-buttons">
                <nuxt-link to="/dashboard/staff/forms/add-project" class="action-btn create-project-btn">Create Project</nuxt-link>
            </div>
        </section>
    </mpage>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})
</script>

<style lang="scss" scoped>
@use "@/style/forms.scss" as *;

.main-content {
    height: 100%;
    box-shadow: 3px 3px 10px var(--text2);
    background: var(--background);
    padding: 25px 50px;
}

nav {
    display: flex;
    gap: 25px;
    align-items: center;
    text-decoration: underline;
    padding-bottom: 25px;
    justify-content: space-between;

    .right {
        display: flex;
        gap: 25px;
    }

    img {
        max-width: 50px;
        filter: invert(1);
    }
}

td {
    cursor: pointer;
}

.action-buttons {
    display: flex;
    gap: 10px;
    padding-block: 25px;
}
</style>
