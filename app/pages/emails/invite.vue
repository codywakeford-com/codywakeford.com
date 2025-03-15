<script setup lang="ts">
import { Button, Head, Hr, Style, Html, Text } from "@vue-email/components"

defineProps({
    title: String,
})
</script>

<template>
    <Head>
        <Style>body: { background: #444; } button: { background: red}</Style>
    </Head>
    <Html lang="en">
        <Text>{{ title || "hello" }}</Text>
        <Hr />
        <Button href="https://example.com" class="button-primary-m">Click me</Button>
    </Html>
</template>
