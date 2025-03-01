<template>
    <mpage>
        <section>
            <h1>Create Project Invitation</h1>

            <h2>Emails</h2>

            <div class="input-group">
                <input type="text" v-model="emailInput" />
                <button @click="addEmail(emailInput)">Add Email</button>
            </div>

            <div class="chips">
                <div class="chip" v-for="(email, index) in emails">
                    <span>{{ email }}</span>
                    <button @click="removeEmail(index)">X</button>
                </div>
            </div>

            <button>Send Email</button>
        </section>
    </mpage>
</template>

<script setup lang="ts">
const emails = ref(["codypwakeford@gmail.com"])
const emailInput = ref("")

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
.mpage {
    height: 100%;
    max-width: 1100px !important;
}

section {
    background-color: white;
    height: 100%;
    box-shadow: 3px 3px 20px lightgrey;
    padding: 50px;
}
</style>
