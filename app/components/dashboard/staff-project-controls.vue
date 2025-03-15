<template>
    <section>
        <nuxt-link :to="`http://localhost:3000/dashboard/staff/forms/quote?projectId=${projectId}`">
            <button-primary-m>Upload Quote</button-primary-m>
        </nuxt-link>
    </section>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id as string
</script>

<style scoped lang="scss">
section {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
