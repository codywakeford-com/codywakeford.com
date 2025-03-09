<template>
    <section class="profile-page">
        <header>
            <h1>Personal Information</h1>
            <p>
                Keep your personal information up-to-date to ensure seamless communication and service delivery. You can
                update your details whenever necessary.
            </p>
        </header>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard-profile",
    middleware: "dashboard",
})
</script>

<style scoped lang="scss">
@use "~/style/profile.scss";
</style>
