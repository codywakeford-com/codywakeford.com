<template>
    <div class="card">
        <h2 class="project-name">{{ subscription.projectName }}</h2>
        <div class="amount">£{{ (subscription.amount / 100).toFixed(2) }}</div>
        <div class="period">{{ subscription.period }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    subscription: {
        projectId: string
        projectName: string
        amount: number
        period: "monthly"
    }
}>()
</script>

<style scoped lang="scss">
.card {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 25px;
    border: 1px solid var(--text2);
    max-width: 300px;
    border-radius: 10px;
    margin-block: 25px;

    h2 {
        font-size: 1.1rem;
        margin-bottom: 15px;
    }
}
</style>
