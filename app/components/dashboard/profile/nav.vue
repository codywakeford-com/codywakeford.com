<template>
    <nav class="profile-nav">
        <header>
            <div class="profile-pic">CW</div>
            <div class="right">
                <h3>{{ $User.user.email }}</h3>
                <h4>{{ $User.user.email }}</h4>
            </div>
        </header>

        <div class="links">
            <nuxt-link to="/dashboard/profile">
                <Icon name="mdi:account-details" size="30" />
                <span>Personal Information</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
            <nuxt-link to="/dashboard/profile/billing">
                <Icon name="fluent:wallet-credit-card-16-filled" size="30" />
                <span>Billing Details</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
        </div>

        <div class="links bottom">
            <nuxt-link @click="AuthController.logout()">
                <Icon name="bx:log-out" size="30" />
                <span>Log out</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
        </div>
    </nav>
</template>

<script setup lang="ts">
import AuthController from "~~/controllers/AuthController"
</script>

<style scoped lang="scss">
@use "~/style/profile.scss";
</style>
