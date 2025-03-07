<template>
    <main class="auth-page">
        <form class="auth-form" @submit.prevent="handleSignUp(email, password)">
            <lheader>
                <h1>Sign Up</h1>
                <p>Fill out the form to create a new account.</p>
            </lheader>

            <div class="input-row">
                <div class="input-group">
                    <label for="">First Name</label>
                    <input type="text" />
                </div>

                <div class="input-group">
                    <label for="">Last Name</label>
                    <input type="text" />
                </div>
            </div>
            <div class="input-group">
                <label for="email">Email Address</label>
                <input class="nova-input" type="text" name="email" v-model="email" />
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input class="nova-input" type="password" name="password" v-model="password" />
            </div>

            <div class="input-group">
                <label for="password">Confirm Password</label>
                <input class="nova-input" type="password" name="password" v-model="password" />
            </div>

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

<style lang="scss" scoped>
input {
    margin-bottom: 0px;
}
.input-group {
    margin-bottom: 15px;
}

label {
    margin-bottom: 0px;
}
.input-row {
    gap: 15px !important;
    input {
        max-width: 155px;
    }
}

button {
    margin-top: 25px;
}
</style>
