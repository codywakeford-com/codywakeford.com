<template>
    <button class="btn">
        <slot />
    </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.btn {
    background: $primary;
    padding: 4px 15px;
    border-radius: $border-radius;
    border: none;
    color: $text-light1;
}
</style>
