<template>
    <section id="call">
        <div id="calendly-embed"></div>
    </section>
</template>

<script setup lang="ts">
const calendly = useCalendly()

onMounted(() => {
    calendly.initInlineWidget({
        url: "https://calendly.com/codypwakeford/meeting",
        parentElement: document.getElementById("calendly-embed"),
    })
})
</script>

<style scoped lang="scss">
header {
    position: relative;
    top: 25px;
    padding-top: 15px;
    color: white;
    font-size: 40px;
    font-weight: bold;
}

#calendly-embed {
    height: 720px;
    min-height: 720px;
}

@media (max-width: 1050px) {
    #calendly-embed {
        height: 1005px;
    }
}

@media (max-width: 650px) {
    header {
        top: 0;
        padding-block: 0 25px;
    }

    section {
        padding-block: 25px;
    }
}

@media (max-width: 350px) {
    section {
        padding-inline: 0px;
    }
}
</style>
