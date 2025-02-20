<template>
  <section class="">
    <header>
      <div class="left">
        <div class="date">{{ dayjs(date).format("dddd, MMMM Do") }}</div>
        <h1 class="project-name">Project Dashboard</h1>
      </div>

      <div class="right">
        <nuxt-link
          target="_blank"
          :to="`https://${project.domain}`"
          class="project-url"
          v-if="project?.domain"
          >https://{{ project?.domain }}</nuxt-link
        >
      </div>
    </header>

    <div class="dashboard-content">
      <div class="left-content">
        <div class="timeline card">
          <dashboard-timeline :project="project" />
        </div>

        <div class="meeting card">
          <dashboard-meetings />
        </div>
      </div>

      <div class="center-content card"></div>
      <div class="right-content card"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { DashboardChatroom } from "#components";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const date = computed(() => {
  let date = Date.now();

  setTimeout(() => {
    date = Date.now();
  }, 1000 * 1800); // 30 mins

  return date;
});

const actions = computed(() => {
  return $Actions.getPendingByProjectId(projectId);
});

const route = useRoute();
const projectId = route.params.id as string;

const project = computed(() => {
  return $Projects.getProjectById(projectId);
});

const files = computed(() => {
  return $Files.getRecent(5);
});

definePageMeta({
  layout: "dashboard",
  middleware: "dashboard",
});
</script>

<style lang="scss">
section {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-inline: 25px;
  height: 100vh;
  width: 100%;
  background: blue;
  padding-block: 25px;
  z-index: 5;

  header {
    width: 100%;
    height: 100px;
    background: red;
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    height: 100%;
    gap: 25px;
  }
}

.card {
  height: 100%;
  width: 100%;
  background: red;
}
</style>
