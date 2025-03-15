<template>
    <mpage>
        <form-kit type="form" class="main-form" @submit="submit()">
            <header>
                <h1>Create Project Invitation</h1>
                <p>This form will invite a list of clients to login to the project dashboard.</p>
            </header>
        </form-kit>
    </mpage>
</template>

<script setup lang="ts">
import PdfController from "~~/controllers/PdfController"
const pdfUrl = ref("")

async function submit(websiteUrl: string) {
    await PdfController.generateWebsiteSummaryReport(websiteUrl)
}

definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})
</script>

<style scoped lang="scss">
@use "@/style/forms.scss" as *;
</style>
