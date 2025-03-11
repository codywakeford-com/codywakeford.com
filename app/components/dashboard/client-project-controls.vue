<template>
    <section>
        <button-primary-m @click="$Calendly.open()">Book meeting</button-primary-m>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
section {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
