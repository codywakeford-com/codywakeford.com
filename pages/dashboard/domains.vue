<template>
    <pre>{{ domains }}</pre>
</template>

<script setup lang="ts">
const domains = ref()

onMounted(async () => {
    //domains.value = await $fetch("https://resellertest.enom.com/interface.asp?command=GetNameSuggestions&uid=YourAccountID&pw=YourApiToken&{param1}={value1}&responsetype=xml")
})

definePageMeta({
    layout: "dashboard",
})
</script>

<style scoped lang="scss"></style>
