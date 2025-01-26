<template>
    <main class="admin-page">
        <VelorisClientsNav />

        <mpage class="admin-mpage">
            <header>
                <h1>Design Board</h1>
            </header>
            <iframe
                style="border: 1px solid rgba(0, 0, 0, 0.1)"
                width="100%"
                height="900px"
                src="https://embed.figma.com/design/m678tqChl7FyhTXQ5Tt5gS/Untitled?node-id=0-1&embed-host=share"
                allowfullscreen
            ></iframe>
        </mpage>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "admin-auth",
})
</script>

<style lang="sass" scoped>
header
    margin-block: 0px 20px

    h1
        font-size: 2rem
        font-weight: bold
</style>
