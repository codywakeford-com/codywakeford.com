<template>
    <pre>{{ $User.user }}</pre>
    <button-primary-m @click="AuthController.logout()" class="nav-item" data-tooltip="Logout">log out</button-primary-m>
</template>

<script setup lang="ts">
import AuthController from "~~/controllers/AuthController"

definePageMeta({
    layout: "dashboard",
    middleware: "dashboard",
})
</script>

<style scoped lang="scss"></style>
