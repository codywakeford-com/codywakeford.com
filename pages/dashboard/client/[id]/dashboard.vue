<template>
    <section class="">
        <header></header>

        <div class="dashboard-content">
            <div class="left-content card"></div>
            <div class="center-content card"></div>
            <div class="right-content card"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
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
