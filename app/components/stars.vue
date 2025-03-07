<template>
    <div class="stars">
        <Icon icon="material-symbols:star" v-for="i of 5" />
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
.stars {
    display: flex;
    gap: 0px;
    align-items: center;

    svg {
        color: orange;
    }
}
</style>
