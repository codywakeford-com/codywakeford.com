<template>
    <main class="auth-page">
        <form class="auth-form" @submit.prevent="handleSignIn(email, password)">
            <lheader>
                <h1>Sign In</h1>
                <p>Log in to your account to continue</p>
            </lheader>

            <cflex>
                <label for="email">Email Address</label>
                <input class="nova-input" type="text" name="email" v-model="email" />
            </cflex>

            <cflex>
                <label for="password">Password</label>
                <input class="nova-input" type="password" name="password" v-model="password" />
            </cflex>

            <anchor to="/auth/forgot-password" class="forgot-password-link">Forgot Password?</anchor>

            <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </p>

            <button type="submit" class="submit-button">
                <loader v-if="loading" color="white" />
                <div v-else>Sign In</div>
            </button>

            <p class="no-account-p">
                Don't have an account?
                <nuxt-link to="/auth/register">Sign Up</nuxt-link>
            </p>
        </form>

        <pre>{{ user }}</pre>
    </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

definePageMeta({
    layout: "auth",
})

const loading = ref(false)
const email = ref("")
const password = ref("")
const errorMessage = ref("")

const user = computed(() => {
    return $User.user
})

async function handleSignIn(email: string, password: string) {
    loading.value = true

    try {
        await $User.login(email, password)
        return navigateTo("/")
    } catch (e) {
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.forgot-password-link {
    margin-left: auto;
    font-size: 0.9rem;
    color: #2d71ea;
    text-decoration: none;
    cursor: pointer;
    margin-bottom: 15px;

    &:hover {
        text-decoration: underline;
    }
}
</style>
