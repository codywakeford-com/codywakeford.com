<script setup lang="ts">
import type Contact from "~/components/contact.vue"
import { cases } from "~/utils/case-studies"
const route = useRoute()
const id = route.params.id as string
const selectedImage = ref(0)
const c = computed(() => {
    const a = cases.find((c) => c.id === id)

    if (!a)
        throw createError({
            statusCode: 404,
        })

    return a
})

function scrollTop() {
    const container = document.getElementById("container")

    if (!container) return

    if (container) {
        container.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
}
</script>
<template>
    <main>
        <sub-hero>{{ c.name }}</sub-hero>

        <article>
            <content>
                <div class="flex" id="container">
                    <div class="sticky-container">
                        <div class="sticky-content">
                            <h2>{{ c.name }}</h2>
                            <p v-for="p of c.description">{{ p }}</p>

                            <h3>Key Features</h3>
                            <ul>
                                <li v-for="i of c.keyFeatures">{{ i }}</li>
                            </ul>

                            <nuxt-link targe="_blank" v-if="c.websiteUrl" :to="c.websiteUrl">
                                <button-primary-m class="go-button">
                                    <span>Live Website</span>
                                    <Icon size="25" name="material-symbols:arrow-right-alt" />
                                </button-primary-m>
                            </nuxt-link>

                            <div class="pages-button-group" v-if="c.images.length - 1">
                                <button
                                    v-for="(i, index) of c.images"
                                    :class="{ active: selectedImage === index }"
                                    @click="((selectedImage = index), scrollTop())"
                                >
                                    {{ index + 1 }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="image-col">
                        <img :src="c.images[selectedImage]" alt="website image" />
                    </div>
                </div>
            </content>
        </article>

        <contact />
    </main>
</template>

<style scoped lang="scss">
main {
    min-height: 94vh;
    position: relative;
}

article {
    margin-block: 75px;
}

.sticky-container {
    min-width: 300px;
}
.sticky-content {
    position: sticky;
    top: 115px;
    padding: 10px;
    z-index: 100000;

    h2 {
        margin-bottom: 15px;
    }

    p {
        line-height: 1.7;
        margin-bottom: 25px;
    }

    ul {
        padding-left: 20px;
        li {
            margin-bottom: 5px;
        }
    }
}

.go-button {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 25px;
    font-size: 1.05rem;
    .iconify {
        color: var(--text1);
    }
}
.pages-button-group {
    display: flex;
    gap: 1px;
    margin-top: 25px;
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;
    border: 3px solid var(--primary);

    button {
        padding: 3px 15px;
        background: var(--primary);
        color: var(--text1);
        font-weight: bold;

        &.active {
            background: var(--text1);
            color: var(--primary);
        }
    }
}
.image-col {
    min-width: 600px;
    max-width: 600px;
    flex: 1;

    img {
        max-width: 600px;
        border: 3px solid var(--primary);
        border-radius: 25px;
        overflow: hidden;
        min-height: 1000px;
        min-width: 600px;
        background: var(--text2);
    }
}
</style>
