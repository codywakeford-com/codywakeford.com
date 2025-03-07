<template>
    <mpage>
        <form class="main-form" @submit.prevent="submit(emails)">
            <header>
                <h1>Create Project Invitation</h1>
                <p>This form will invite a list of clients to login to the project dashboard.</p>
            </header>

            <h2>Emails</h2>

            <div class="input-group">
                <label for="email-input">Add client emails</label>
                <input type="text" v-model="emailInput" name="email-input" />
                <button type="button" @click="addEmail(emailInput)">Add Email</button>
            </div>

            <div class="chips">
                <div class="chip" v-for="(email, index) in emails">
                    <span>{{ email }}</span>
                    <button @click="removeEmail(index)">X</button>
                </div>
            </div>

            <button-primary-m type="submit" class="submit-button" :disabled="loading">
                {{ loading ? "Loading" : "SendEmail" }}
            </button-primary-m>
        </form>
    </mpage>
</template>

<script setup lang="ts">
const emails = ref(["codypwakeford@gmail.com"])
const emailInput = ref("")
const loading = ref(false)

async function submit(emails: string[]) {
    if (!emails.length) return

    loading.value = true
    await ProjectsController.createProject(emails)
    loading.value = false
}

function addEmail(email: string) {
    if (emailInput.value.trim() === "") return
    emails.value.push(email)

    emailInput.value = ""
}

function removeEmail(index: number) {
    emails.value.splice(index, 1)
}

definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})
</script>

<style scoped lang="scss">
@use "@/style/forms.scss" as *;
</style>
