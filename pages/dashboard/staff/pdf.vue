<template>
    <main>
        <dashboard-staff-quote-form />
        <dashboard-staff-proposal-form />

        <div class="file-preview">
            <embed v-if="$Projects.quoteUrl" :src="$Projects.quoteUrl" type="application/pdf" />
            <embed v-if="$Projects.proposalUrl" :src="$Projects.proposalUrl" type="application/pdf" />
        </div>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
})
</script>

<style scoped lang="scss"></style>
