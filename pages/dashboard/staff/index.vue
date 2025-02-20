<template>
  <mpage class="admin-mpage">
    <dashboard-project-list interface="staff" />

    <div class="action-buttons">
      <btn @click="$Projects.createDummy()" class="action-btn"
        >Create Dummy Project</btn
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

<style lang="scss" scoped></style>
