<template>
    <header :class="{ dark: props.color === 'dark' }">
        <h3>
            <slot name="sub">#slot</slot>
        </h3>

        <h2>
            <slot name="header">#header</slot>
        </h2>
    </header>
</template>

<script setup lang="ts">
interface Props {
    color: "light" | "dark"
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
header {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-inline: auto;
    text-align: center;
    max-width: 600px;
    color: var(--text1);

    &.dark {
        color: var(--primary);

        h2,
        h3 {
            &::after,
            &::before {
                background: var(--primary);
            }
        }
    }
}

h2 {
    font-weight: normal;
    font-size: 2rem;
}

h3 {
    position: relative;
    width: min-content;
    white-space: nowrap;
    margin-inline: auto;
    font-size: 0.8rem;

    &::before,
    &::after {
        content: "";
        position: absolute;
        height: 2px;
        width: 20px;
        background: var(--text1);
        top: 50%;
        transform: translateY(-50%);
    }

    &::before {
        left: -30px;
    }

    &::after {
        right: -30px;
    }
}
</style>
