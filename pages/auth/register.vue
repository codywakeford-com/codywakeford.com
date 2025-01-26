<template>
    <main class="auth-page">
        <form class="auth-form" @submit.prevent="handleSignUp('email')">
            <lheader>
                <h1>Sign Up</h1>
                <p>Fill out the form to create a new account.</p>
            </lheader>

            <cflex>
                <label for="email">Email Address</label>
                <input class="nova-input" type="text" name="email" v-model="email" />
            </cflex>

            <cflex>
                <label for="password">Password</label>
                <input class="nova-input" type="password" name="password" v-model="password" />
            </cflex>

            <p v-if="successMessage" class="success-message">
                {{ successMessage }}
            </p>
            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </p>

            <button type="submit">
                <loader color="black" v-if="loading" />
                <div v-else>Sign Up</div>
            </button>

            <div class="divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <rflex class="sign-in-options">
                <chip @click="handleSignUp('google')">
                    <Icon icon="logos:google" height="25" />
                </chip>
            </rflex>

            <p class="no-account-p">
                Already have an account?
                <nuxt-link to="/auth/login">Sign In</nuxt-link>
            </p>
        </form>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "auth",
    middleware: "dashboard",
})
import { Icon } from "@iconify/vue"

const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

async function handleSignUp(provider: AuthProvider) {
    if (provider === "email") loading.value = true
    const error = await signUp(provider, email.value, password.value)

    if (error) {
        successMessage.value = ""
        errorMessage.value = error
    } else {
        localStorage.setItem("verifyEmail", email.value)
        navigateTo("/auth/verify-email")
    }

    loading.value = false
}
</script>

<style lang="scss" scoped></style>
