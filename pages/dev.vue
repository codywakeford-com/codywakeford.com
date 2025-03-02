<template>
    <main>
        <button @click="createObject('/testing', { hello: 'world' })">addOBj</button>
        <button @click="deleteObject('/testing/6c9wVMP2ae7lUwUlnirY')">deleteObject</button>
        <button @click="readObject('/testing/wK8wIvBJNlHHQSyufLik')">readObject</button>
        <button @click="showModalById('payment-modal')">open payment modal</button>
        <button @click="$Calendly.open">Book a call</button>
    </main>
</template>

<script setup lang="ts">
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
