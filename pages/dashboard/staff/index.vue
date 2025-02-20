<template>
  <mpage class="admin-mpage">
    <dashboard-project-list interface="staff" />

    <div class="action-buttons">
      <btn @click="$Projects.createProject('full')" class="action-btn"
        >Create Full Project</btn
      >

      <btn @click="$Projects.createProject('build')" class="action-btn"
        >Create Development Project</btn
      >

      <btn to="/admin/clients/chatroom" class="action-btn">Chatroom</btn>

      <btn
        preset="dark"
        @click="openModal('createProject')"
        class="action-btn create-project-btn"
        >Create Project</btn
      >
    </div>
  </mpage>
</template>

<script setup lang="ts">
const projects = computed(() => {
  return $Projects.getProjects;
});

definePageMeta({
  layout: "dashboard",
  middleware: "dashboard",
});
</script>

<style lang="scss" scoped>
.action-buttons {
  display: flex;
  gap: 10px;
  padding-block: 25px;
}
</style>
