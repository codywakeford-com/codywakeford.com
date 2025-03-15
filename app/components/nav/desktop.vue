<template>
    <nav>
        <content>
            <div class="left">
                <nuxt-link to="/#hero">
                    <img src="/assets/cw-logo.webp" class="logo" alt="Site Logo" />
                </nuxt-link>
            </div>

            <div class="right">
                <nav-item-list />
            </div>
        </content>
    </nav>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
nav {
    background-color: white;
    border-bottom: 3px solid var(--primary);

    .content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-block: 15px;

        .right {
            display: flex;
            align-items: center;
            gap: 25px;
        }
    }
}

.logo {
    height: 40px;
    filter: invert(1);
}

a,
button {
    font-size: 0.9rem;
    cursor: pointer;
}
</style>
