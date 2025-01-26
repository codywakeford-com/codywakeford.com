<template>
    <main>
        <pre>
            {{ user }}
        </pre>
    </main>
</template>

<script setup lang="ts">
const user = computed(() => {
    return $User.get || {}
})

definePageMeta({
    layout: "dashboard",
})
</script>

<style lang="scss" scoped>
main {
    overflow-y: scroll;
    padding: 25px;
}
</style>
