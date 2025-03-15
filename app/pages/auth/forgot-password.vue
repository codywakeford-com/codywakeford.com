<template>
    <main class="auth-page">
        <form-kit type="form" @submit.prevent="handleResetPassword" class="auth-form">
            <header>
                <h1>Forgot Password?</h1>
                <p>
                    Enter the email address associated with your account and we will send a link to reset your password.
                </p>
            </header>

            <form-kit type="email">
                <label for="email">Email Address</label>
                <input type="text" name="email" v-model="email" />
            </form-kit>

            <p v-if="successMessage" class="success-message">
                {{ successMessage }}
            </p>
            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </p>

            <template #submit>
                <button type="submit" :disabled="loading">
                    <loader v-if="loading" color="white" />
                    <span v-else>Submit</span>
                </button>
                <p class="no-account-p">
                    Remember your password?
                    <nuxt-link to="/auth/login">Sign In</nuxt-link>
                </p>
            </template>
        </form-kit>
    </main>
</template>

<script setup>
definePageMeta({
    layout: "auth",
})

const loading = ref(false)
const email = ref("")
const successMessage = ref("")
const errorMessage = ref("")

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
