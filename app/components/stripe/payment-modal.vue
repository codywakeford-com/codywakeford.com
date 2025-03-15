<template>
    <dialog ref="modal" @click="modal?.close()" id="payment-modal">
        <!-- <stripe-payment-card /> -->
    </dialog>
</template>

<script setup lang="ts">
const modal = ref<HTMLDialogElement | null>(null)
</script>

<style lang="scss" scoped></style>
