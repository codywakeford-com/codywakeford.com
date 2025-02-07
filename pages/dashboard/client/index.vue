<template>
  <main>
    <dashboard-project-list
      interface="client"
      v-if="$Projects.projects.length"
    />

    <div class="no-projects-box" v-else>
      <Icon icon="ix:project-new" width="50" color="grey" />
      <h2>No Projects</h2>
      <p>Feel free to book a call to set one up.</p>

      <button-primary-m @click="createProject(userProject)"
        ><Icon icon="material-symbols:add-2" color="white" width="15" />
        New Project
      </button-primary-m>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
definePageMeta({
  layout: "dashboard",
  middleware: "dashboard",
});

async function createProject(project: Project) {
  await $Projects.create(project);
  await $Projects.init();
  await navigateTo(`/dashboard/client/${project.id}`);
}

const userProject: Project = {
  id: uuid(),
  emails: [$User.email],
  phase: "discovery",
  design: {
    accepted: false,
  },
};
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
