<template>
    <div class="socials">
        <nuxt-link to="https://www.linkedin.com/in/cody-wakeford-a184a430a/" target="_blank">
            <icon-linkedin width="25" />
        </nuxt-link>

        <nuxt-link
            target="_blank"
            to="https://www.facebook.com/people/Cody-Wakeford/pfbid02iF62HX95VFg2Q8nz9PDH23B4qA9gLxobjKmHLKp7sCU4g8AhXpWoshrwuiC66X7Ul/"
        >
            <icon-facebook width="25" />
        </nuxt-link>

        <nuxt-link target="_blank" to="https://discord.com/users/cbass3218">
            <icon-discord width="25" />
        </nuxt-link>

        <nuxt-link target="_blank" to="https://x.com/CodyWakeford">
            <icon-twitter width="25" />
        </nuxt-link>

        <nuxt-link target="_blank" to="https://github.com/codywakeford">
            <icon-github width="25" />
        </nuxt-link>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.socials {
    display: flex;
    gap: 10px;
}
</style>
