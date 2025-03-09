<template>
    <main class="auth-page">
        <form
            class="auth-form"
            @submit.prevent="submit(form.firstName.input, form.lastName.input, form.email.input, form.password.input)"
        >
            <lheader>
                <h1>Sign Up</h1>
                <p>Fill out the form to create a new account.</p>
            </lheader>

            <div class="input-row">
                <div class="input-group">
                    <label for="">First Name</label>
                    <input type="text" v-model="form.firstName.input" />
                    <div class="error" v-for="e in form.firstName.errors">{{ e }}</div>
                </div>

                <div class="input-group">
                    <label for="">Last Name</label>
                    <input type="text" v-model="form.lastName.input" />
                    <div class="error" v-for="e in form.lastName.errors">{{ e }}</div>
                </div>
            </div>
            <div class="input-group">
                <label for="email">Email Address</label>
                <input class="nova-input" type="text" name="email" v-model="form.email.input" />
                <div class="error" v-for="e in form.email.errors">{{ e }}</div>
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input class="nova-input" type="password" name="password" v-model="form.password.input" />
                <div class="error" v-for="e in form.password.errors">{{ e }}</div>
            </div>

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
import AuthController from "~~/controllers/AuthController"
import { required, isValidEmail, InputValidationController } from "~~/controllers/InputValidationController"

definePageMeta({
    layout: "auth",
})

const loading = ref(false)

const form = ref<FormInput>({
    firstName: {
        input: "",
        errors: [],
        validators: [required],
    },

    lastName: {
        input: "",
        errors: [],
        validators: [required],
    },

    email: {
        input: "",
        errors: [],
        validators: [required, isValidEmail],
    },

    password: {
        input: "",
        errors: [],
        validators: [required],
    },
})

async function submit(firstName: string, lastName: string, email: string, password: string) {
    if (!InputValidationController.validate(form)) return

    loading.value = true
    try {
        await AuthController.register(firstName, lastName, email, password)
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
