<template>
    <section id="reviews">
        <content>
            <section-sub-header color="light">
                <template #sub>HIGHEST QUALITY</template>
                <template #header>Don't Take My Word For It</template>
            </section-sub-header>

            <div class="cards">
                <div class="card" v-for="(testimonial, index) of testimonials">
                    <p>{{ testimonial.text }}</p>

                    <div>
                        <stars />
                        <nuxt-link :to="`https://${testimonial.url}`" target="_blank">
                            <h4>{{ testimonial.url }}</h4>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </content>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
interface Review {
    url: string
    text: string
}

const testimonials: Review[] = [
    {
        url: "skyguardroofing.co.uk",
        text: "Working with Cody was a fantastic experience. He took the time to understand our needs and created a stunning, user-friendly website for Apex Specialists. His professionalism, attention to detail, and dedication were evident throughout the project. We couldn't be happier with the result and highly recommend Cody for anyone looking for top-notch web development.",
    },
    {
        url: "yerooumaart.co.uk",
        text: "Web designer Cody Wakeford crafted a website for me. It is so stunning and eye catching. I am so thrilled with the site. It is easy to navigate around and the facility to use the admin section to add and remove items, to edit and adjust is really pleasing. Thank you for a brilliant job!",
    },
    {
        url: "gravityteam.co",
        text: "Cody truly understood our vision and turned it into a sleek, functional website that perfectly represents our brand. The process was smooth, communication was great, and the final result has exceeded our expectations. We’ve already received fantastic feedback from our clients. Highly recommend!",
    },
]
</script>

<style lang="scss" scoped>
section {
    background: $primary;
    padding-block: var(--page-gutter) calc(var(--page-gutter) * 2);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.stars {
    display: flex svg {

    }
}

.cards {
    display: flex;
    gap: 25px;
    justify-content: center;
    flex-wrap: wrap;

    .card {
        max-width: 300px;
        background: white;
        padding: 25px;
        height: min-content;
        border-radius: $border-radius;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 25px;
        flex: 1 250px 300px;
    }
}
</style>
