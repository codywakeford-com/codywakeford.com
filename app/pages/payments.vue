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

section {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    background: white;
    padding-block: 35px 25px;
    padding-inline: 25px;
    gap: 20px;
    border-radius: 5px;
    border: 1px solid $text-light2;
}
</style>
