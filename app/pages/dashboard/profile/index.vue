<template>
    <section class="profile-page">
        <header class="page-header">
            <h1>Personal Information</h1>
            <p>
                Keep your personal information up-to-date to ensure seamless communication and service delivery. You can
                update your details whenever necessary.
            </p>
        </header>

        <section>
            <header class="sub-header">
                <h2>BASICS</h2>
            </header>

            <div class="grid">
                <div class="left">
                    <div>Full Name</div>
                    <div>Email</div>
                </div>

                <div class="right">
                    <div>{{ $User.state.user.firstName }} {{ $User.state.user.lastName }}</div>
                    <div>{{ $User.state.user.email }}</div>
                </div>
            </div>
        </section>

        <section>
            <header class="sub-header">
                <h2>PREFERENCES</h2>
            </header>
        </section>
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

.grid {
    display: grid;
    grid-template-columns: 200px auto;
    padding-block: 15px;

    .left div,
    .right div {
        padding-block: 15px;
        padding-inline: 10px;
    }

    .left div {
        color: var(--text5);
    }
}
</style>
