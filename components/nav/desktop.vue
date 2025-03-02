<template>
    <nav>
        <content>
            <div class="left">
                <nuxt-link to="/#hero">
                    <img src="/assets/cw-logo.webp" class="logo" alt="Site Logo" />
                </nuxt-link>
            </div>

            <div class="right">
                <nuxt-link to="/#hero">Home</nuxt-link>
                <nuxt-link to="/payments">Payments</nuxt-link>
                <nuxt-link to="/#services">Services</nuxt-link>
                <nuxt-link to="/#why">Why Me?</nuxt-link>

                <nuxt-link to="/#reviews">Reviews</nuxt-link>
                <nuxt-link to="/#contact">Contact Me</nuxt-link>

                <nuxt-link v-if="!$User.state.user?.id" to="/auth/login">
                    <button-primary-m>Sign In</button-primary-m>
                </nuxt-link>
                <nuxt-link to="/dashboard/client" v-else>
                    <button-primary-m>Dashboard</button-primary-m>
                </nuxt-link>
            </div>
        </content>
    </nav>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
nav {
    background-color: white;

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

.exact-link-active {
    text-decoration: underline;
}

a,
button {
    font-size: 0.9rem;
    cursor: pointer;
}
</style>
