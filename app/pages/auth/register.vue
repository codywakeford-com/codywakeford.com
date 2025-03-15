<template>
    <main class="auth-page">
        <form-kit novalidate type="form" @submit="submit()" :errors="errors">
            <header>
                <h1>Register</h1>
                <p>Fill out the form to create a new account</p>
            </header>

            <div class="input-row">
                <FormKit
                    type="email"
                    label="First Name"
                    name="firstName"
                    v-model="input.firstName"
                    validation="required"
                />
                <FormKit
                    type="email"
                    label="Last Name"
                    name="lastName"
                    v-model="input.lastName"
                    validation="required"
                />
            </div>

            <FormKit type="email" label="Email" name="email" v-model="input.email" validation="required|email" />

            <FormKit type="group">
                <FormKit
                    type="password"
                    name="password"
                    value="super-secret"
                    label="Password"
                    validation="required"
                    v-model="input.password"
                />
                <FormKit
                    type="password"
                    name="password_confirm"
                    label="Confirm password"
                    validation="required|confirm"
                    validation-label="Password confirmation"
                    v-model="input.confirmPassword"
                />
            </FormKit>

            <template #submit>
                <button type="submit" :disabled="loading">
                    <loader v-if="loading" color="white" />
                    <span v-else>Submit</span>
                </button>

                <p class="no-account-p">
                    Already have an account?
                    <nuxt-link to="/auth/login">Sign In</nuxt-link>
                </p>
            </template>
        </form-kit>
    </main>
</template>

<script setup lang="ts">
import AuthController from "~~/controllers/AuthController"

definePageMeta({
    layout: "auth",
})

const loading = ref(false)

const input = ref({
    firstName: "cody",
    lastName: "wakeford",
    email: "cody@codywakeford.com",
    password: "123123",
    confirmPassword: "123123",
})

const errors = ref<string[]>([])

async function submit() {
    loading.value = true

    const { firstName, lastName, email, password } = input.value
    const { error } = await AuthController.register(firstName, lastName, email, password)

    if (error) errors.value.push(error)

    loading.value = false
}
</script>

<style lang="scss" scoped></style>
