<template>
    <main>
        <!-- <pre>
            {{ user }}
        </pre> -->

        <button @click="createObject('/testing', { hello: 'world' })">addOBj</button>
        <!-- <button @click="updateObject('/projects/sdoihggijergej/activity-log', { "hello": "world"})">updateObj</button> -->
        <button @click="deleteObject('/testing/6c9wVMP2ae7lUwUlnirY')">deleteObject</button>
        <button @click="readObject('/testing/wK8wIvBJNlHHQSyufLik')">readObject</button>

        <h2>arrays</h2>

        <button @click="readArray('/testing')">readArray</button>
    </main>
</template>

<script setup lang="ts">
const user = computed(() => {
    return $User.get || {}
})

function performFunction() {
    createObject("/testing", { hello: "world" })
}

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
