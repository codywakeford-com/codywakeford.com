<template>
    <main class="auth-page">
        <form @submit.prevent="handleResetPassword" class="auth-form">
            <lheader>
                <h1>Forgot Password?</h1>
                <p>
                    Enter the email address associated with your account and we will send a link to
                    reset your password.
                </p>
            </lheader>

            <cflex>
                <label for="email">Email Address</label>
                <input type="text" name="email" v-model="email" />
            </cflex>

            <p v-if="successMessage" class="success-message">
                {{ successMessage }}
            </p>
            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </p>
            <button-primary-m type="submit" class="submit-button">
                <loader v-if="loading" color="white" />
                <div v-else>Reset Password</div>
            </button-primary-m>

            <p class="no-account-p">
                Remember your password?
                <nuxt-link to="/auth/login">Sign In</nuxt-link>
            </p>
        </form>
    </main>
</template>

<script setup>
import { Icon } from "@iconify/vue"

definePageMeta({
    layout: "auth",
    middleware: "dashboard",
})

const loading = ref(false)
const email = ref("")
const successMessage = ref("")
const errorMessage = ref("")

const { $authUtils } = useNuxtApp()

const handleResetPassword = async () => {
    loading.value = true
    let response = await $authUtils.resetPassword(email.value)

    if (response.success) {
        successMessage.value = response.message
    } else {
        errorMessage.value = response.message
    }

    loading.value = false
}
</script>

<style lang="scss" scoped>
.no-account-p {
    margin-top: 15px;
}
</style>
