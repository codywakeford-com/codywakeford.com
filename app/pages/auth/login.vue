<template>
    <main class="auth-page">
        <FormKit
            class="auth-form"
            :errors="errors"
            novalidate
            type="form"
            @submit="handleSignIn(input.email, input.password)"
        >
            <header>
                <h1>Login</h1>
                <p>Log in to your account to continue</p>
            </header>

            <FormKit
                type="email"
                label="Email"
                name="email"
                v-model="input.email"
                validation="required|email"
                :required="false"
            />

            <FormKit type="password" label="Password" name="password" v-model="input.password" validation="required" />

            <nuxt-link to="/auth/forgot-password" class="forgot-password-link">Forgot Password?</nuxt-link>

            <template #submit>
                <button type="submit" :disabled="loading">
                    <loader v-if="loading" color="white" />
                    <span v-else>Submit</span>
                </button>
                <p class="no-account-p">
                    Don't have an account?
                    <nuxt-link to="/auth/register">Sign Up</nuxt-link>
                </p>
            </template>
        </FormKit>
    </main>
</template>

<script setup lang="ts">
import AuthController from "~~/controllers/AuthController"

definePageMeta({
    layout: "auth",
})

const loading = ref(false)
const input = ref({
    email: "",
    password: "",
})
const errors = ref<string[]>([])

async function handleSignIn(email: string, password: string) {
    loading.value = true
    const { error } = await AuthController.login(email, password)

    if (error) errors.value.push(error)
    loading.value = false
}
</script>

<style lang="scss" scoped>
.error-message {
    color: $danger1;
}
</style>
