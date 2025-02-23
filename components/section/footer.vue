<template>
    <section>
        <content>
            <nuxt-link class="left" to="#hero">
                <img src="/assets/cw-logo.webp" alt="Cody Wakeford Logo" />
            </nuxt-link>
            <div class="center"></div>
            <div class="right">
                <socials />
            </div>
        </content>
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
section {
    position: relative;
    background: $primary;
    z-index: 2;
    height: $footer-height;
}

.content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding-block: 25px;
    align-items: center;
}

.right {
    margin-left: auto;
}

.center {
    text-align: center;
    color: $text-light1;
}

.socials {
    color: white;
}

img {
    width: 40px;
}

@media (max-width: 730px) {
    .content {
        display: grid;
        grid-template-columns: 1fr 1fr;

        .center {
            display: none;
        }
    }
}
</style>
