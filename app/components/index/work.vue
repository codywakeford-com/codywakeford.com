<script setup lang="ts">
interface Card {
    url: string
}

const cards: Card[] = [
    {
        url: new URL("/assets/preview-site1.webp", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site2.webp", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site3.webp", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site4.webp", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site5.webp", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site6.png", import.meta.url).href,
    },
    {
        url: new URL("/assets/preview-site7.png", import.meta.url).href,
    },
]
</script>

<template>
    <section>
        <content>
            <section-sub-header color="dark">
                <template #sub>MY WORK</template>
                <template #header>Here Is Some of My Latest Work</template>
            </section-sub-header>

            <div class="row">
                <div v-for="(i, index) in cards" class="card">
                    <img :src="i.url" alt="" />
                    <div class="overlay">
                        <span>View case study</span>
                    </div>
                </div>
            </div>
        </content>
    </section>
</template>

<style lang="scss" scoped>
section {
    padding-block: 50px 75px;
    border-bottom: 5px solid var(--primary);
}
.row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 25px;
    padding-block: 50px;
}

.card {
    height: 200px;
    width: 300px;
    border: 3px solid var(--primary);
    border-radius: 25px;
    position: relative;
    overflow: hidden;
    transition: all 0.15s;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
    }

    .overlay {
        display: flex;
        opacity: 0;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: var(--text1a);
        left: 0;
        top: 0;
        transition: all 0.15s;
    }

    &:hover {
        transform: translateY(-10px) scale(1.05);

        .overlay {
            opacity: 1;
        }
    }
}
</style>
