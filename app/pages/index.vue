<template>
    <main>
        <index-hero />
        <index-services />
        <index-work />
        <index-why />
        <testimonials />
        <contact />
        <!-- <index-calendly-inline /> -->
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    colorMode: "light",
})
</script>

<style lang="scss" scoped>
main {
    overflow: hidden;
}
</style>
