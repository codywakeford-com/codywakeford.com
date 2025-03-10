<template>
    <div class="pattern-background"></div>
    <main>
        <stripe-payment-card />
    </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
main {
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
