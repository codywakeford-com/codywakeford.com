<template>
    <main class="auth-page">
        <form class="auth-form" @submit.prevent="handleSignUp(email, password)">
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
})

const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

async function handleSignUp(email: string, password: string) {
    loading.value = true

    try {
        await $User.register(email, password)
    } catch (e) {
        errorMessage.value = String(e)
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped></style>
