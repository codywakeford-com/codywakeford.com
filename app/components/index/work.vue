<script setup lang="ts">
import { cases } from "~/utils/case-studies"
</script>

<template>
    <section id="case-studies">
        <content>
            <section-sub-header color="dark">
                <template #sub>MY WORK</template>
                <template #header>Here Is Some of My Latest Work</template>
            </section-sub-header>

            <div class="row">
                <nuxt-link :to="`/case-studies/${i.id}`" v-for="(i, index) in cases" class="card">
                    <img :src="i.previewImage" alt="" />
                    <div class="overlay">
                        <span>View case study</span>
                    </div>
                </nuxt-link>
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
        width: 300px;
        height: 200px;
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        color: var(--text1a);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
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
