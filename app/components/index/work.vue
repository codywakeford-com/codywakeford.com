<template>
    <section>
        <content>
            <section-sub-header color="dark">
                <template #sub>MY WORK</template>
                <template #header>Here Is Some of My Latest</template>
            </section-sub-header>

            <carousel>
                <carousel-item v-for="card of cards">Hello</carousel-item>
            </carousel>
            <!-- <div class="cards"></div> -->
        </content>
    </section>
</template>

<script setup lang="ts">
interface Card {
    url: string
    smallImage: string
    largeImage: string
}

const cards: Card[] = [
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
    {
        url: "",
        smallImage: "",
        largeImage: "",
    },
]
</script>

<style lang="scss" scoped>
.content {
    padding-block: var(--page-gutter) calc(var(--page-gutter) * 2);
    color: var(--text4);
    display: flex;
    flex-direction: column;
    gap: 50px;
}

// .cards {
//     display: flex;
//     gap: 50px;
//     justify-content: center;

//     .card {
//         height: 300px;
//         width: 300px;
//         background: var(--secondary);
//     }
// }</style>
