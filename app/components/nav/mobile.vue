<template>
    <div :class="{ 'nav-active': navActive }" class="nav-box">
        <nav>
            <div class="left">
                <img src="/assets/cw-logo.webp" alt="logo" />
            </div>

            <div class="right">
                <button @click="navActive = false">
                    <Icon v-if="navActive" icon="akar-icons:cross" width="25" color="black" />
                </button>

                <button @click="navActive = true">
                    <Icon v-if="!navActive" width="30" icon="solar:hamburger-menu-linear" color="black" />
                </button>
            </div>
        </nav>

        <aside>
            <nuxt-link @click="navActive = false" to="/#hero">Home</nuxt-link>
            <nuxt-link @click="navActive = false" to="/#services">Services</nuxt-link>
            <nuxt-link @click="navActive = false" to="/#why">Why Me?</nuxt-link>
            <nuxt-link @click="navActive = false" to="/#reviews">Reviews</nuxt-link>
            <nuxt-link @click="navActive = false" to="/#contact">Contact Me</nuxt-link>

            <nuxt-link @click="navActive = false" v-if="!$User.state.user?.id" to="/auth/login">
                <button-primary-m>Sign In</button-primary-m>
            </nuxt-link>

            <nuxt-link @click="navActive = false" to="/dashboard/client" v-else>
                <button-primary-m>Dashboard</button-primary-m>
            </nuxt-link>
        </aside>
    </div>
</template>

<script setup lang="ts">
const navActive = ref(false)
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
.nav-box {
    position: relative;
    width: 100%;

    &.nav-active {
        aside {
            top: 100%;
        }

        nav {
            border-bottom: 0;
        }
    }
}

nav {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--background);
    border-bottom: 3px solid var(--primary);
    padding-block: 10px;
    padding-inline: 25px;
    z-index: 100;
}

.left {
    img {
        width: 45px;
        filter: invert(1);
    }
}

aside {
    position: absolute;
    width: 100vw;
    left: 0;
    top: -265%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: -1;
    background: var(--background);
    border-bottom: 3px solid var(--primary);

    padding-inline: 25px;
    padding-block: 25px 25px;
}

button {
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
