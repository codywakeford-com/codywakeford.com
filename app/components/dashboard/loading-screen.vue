<template>
    <section class="loading-screen">
        <div class="pattern-background"></div>
        <img class="logo-image" src="/assets/cw-logo-primary.png" alt="logo" />
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
section {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    z-index: 1002;
}

.logo-image {
    height: 100px;
    animation: logo 1s infinite ease-in-out;
}

@keyframes logo {
    0% {
        transform: rotate(0deg); /* Start at 0 degrees */
    }

    10% {
        transform: rotate(0deg);
    }

    80% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(360deg); /* Complete the full rotation */
    }
}
</style>
