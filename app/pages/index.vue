<template>
    <main>
        <index-hero />
        <index-services />
        <index-why />
        <testimonials />
        <contact />
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    colorMode: "light",
})
</script>

<style lang="scss" scoped>
main {
    overflow-x: hidden;
}
</style>
