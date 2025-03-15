<template>
    <nuxt-link to="/#hero">Home</nuxt-link>
    <nuxt-link to="/about">About</nuxt-link>
    <nuxt-link to="/#reviews">Reviews</nuxt-link>
    <nuxt-link to="/#contact">Contact Me</nuxt-link>
    <nuxt-link to="/payments">Payments</nuxt-link>

    <nuxt-link v-if="!$User.state.isLoggedIn" to="/auth/login">
        <button-primary-m>Sign In</button-primary-m>
    </nuxt-link>

    <nuxt-link v-else-if="$User.state.isLoggedIn && !gflags.dashboard">
        <button-primary-m @click="AuthController.logout()">Sign Out</button-primary-m>
    </nuxt-link>

    <nuxt-link to="/dashboard/client" v-else-if="$User.state.isLoggedIn">
        <button-primary-m>Dashboard</button-primary-m>
    </nuxt-link>
</template>

<script setup lang="ts">
const $User = useUserStore()
import gflags from "~/utils/global-flags"
import AuthController from "~~/controllers/AuthController"
</script>

<style scoped lang="scss"></style>
