<template>
    <section>
        <section-sub-header color="light">
            <template #sub>HIGHEST QUALITY</template>
            <template #header>Don't Take My Word For It</template>
        </section-sub-header>

        <div class="carousel-container">
            <div ref="carousel" class="carousel">
                <div class="carousel-card" :style="{ transform: `translateX(${item.offset}px)`, opacity: item.opacity }"
                    v-for="(item, index) in testimonials">
                    <div class="text">{{ item.text }}</div>
                    <flex class="stars">
                        <Icon color="gold" icon="material-symbols:star" width="18" v-for="_ in 5" />
                    </flex>
                    <h6>{{ item.author }}</h6>
                </div>
            </div>
            <div class="controls">
                <button @click="move(1)">
                    <Icon icon="material-symbols:arrow-left-alt-rounded" width="25" />
                </button>
                <button @click="move(-1)">
                    <Icon icon="material-symbols:arrow-right-alt-rounded" width="25" />
                </button>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue"

const carousel = ref<HTMLElement | null>(null)

interface Testimonial {
    text: string
    author: string
    offset: number
    opacity: 0 | 1
}

let testimonials: Ref<Testimonial[]> = ref([
    {
        text: "Working with Cody was a fantastic experience. He took the time to understand our needs and created a stunning, user-friendly website for Apex Specialists. His professionalism, attention to detail, and dedication were evident throughout the project. We couldn't be happier with the result and highly recommend Cody for anyone looking for top-notch web development.",
        author: "skyguardroofing.co.uk",
        offset: 0,
        opacity: 1,
    },

    {
        text: "Web designer Cody Wakeford crafted a website for me. It is so stunning and eye catching. I am so thrilled with the site. It is easy to navigate around and the facility to use the admin section to add and remove items, to edit and adjust is really pleasing. Thank you for a brilliant job!",
        author: "yerooumaart.co.uk",
        offset: 0,
        opacity: 1,
    },
    {
        text: "Cody truly understood our vision and turned it into a sleek, functional website that perfectly represents our brand. The process was smooth, communication was great, and the final result has exceeded our expectations. We’ve already received fantastic feedback from our clients. Highly recommend!",
        author: "gravityteam.co",
        offset: 0,
        opacity: 1,
    },
    {
        text: "I recently had the pleasure of working with Cody Wakeford to build my website from the ground up, and I can't recommend him highly enough! From the very beginning, Cody demonstrated an incredible understanding of my vision and goals, translating them into a beautifully designed website tailored to my needs.What stood out to me the most was his willingness to incorporate all the features I wanted. He took the time to listen and offered insightful suggestions that enhanced my initial ideas. Every detail was given attention, and the final product turned out even better than I had imagined. Cody's communication skills are exceptional. He kept me updated throughout the entire process, promptly addressing any questions or concerns I had. It truly felt like a collaborative effort, and his positive attitude made the experience enjoyable. If you're looking for someone who is not only talented but also truly invested in delivering outstanding results, Cody is your person. I’m thrilled with my new website and look forward to working with him on future projects!",
        author: "primeproperty.es",
        offset: 0,
        opacity: 1,
    },
    {
        text: "Working with Cody was a fantastic experience. He took the time to understand our needs and created a stunning, user-friendly website for Apex Specialists. His professionalism, attention to detail, and dedication were evident throughout the project. We couldn't be happier with the result and highly recommend Cody for anyone looking for top-notch web development.",
        author: "skyguardroofing.co.uk",
        offset: 0,
        opacity: 1,
    },

    {
        text: "Web designer Cody Wakeford crafted a website for me. It is so stunning and eye catching. I am so thrilled with the site. It is easy to navigate around and the facility to use the admin section to add and remove items, to edit and adjust is really pleasing. Thank you for a brilliant job!",
        author: "yerooumaart.co.uk",
        offset: 0,
        opacity: 1,
    },
    {
        text: "Cody truly understood our vision and turned it into a sleek, functional website that perfectly represents our brand. The process was smooth, communication was great, and the final result has exceeded our expectations. We’ve already received fantastic feedback from our clients. Highly recommend!",
        author: "gravityteam.co",
        offset: 0,
        opacity: 1,
    },
])

const leftIndex = ref(0) // count from the left most card
const rightIndex = ref(testimonials.value.length - 1) // count from the right most card

const activeIndexes = computed(() => {
    const indexes = []
    const centerIndex = Math.floor((testimonials.value.length - 1) / 2) || 1
    const center = (leftIndex.value + centerIndex) % testimonials.value.length

    indexes.push(center)

    if (mobile.value) return indexes
    const left = (center - 1 + testimonials.value.length) % testimonials.value.length
    indexes.push(left)

    const right = (center + 1) % testimonials.value.length
    indexes.push(right)

    return indexes
})

const mobile = ref(false)
onMounted(() => applyClasses())
function move(direction: number) {
    const children = carousel.value?.children

    if (!children) return
    const style = window.getComputedStyle(children[0])
    const marginLeft = parseFloat(style.marginLeft)
    const marginRight = parseFloat(style.marginRight)

    const width = marginLeft + marginRight + children[0].getBoundingClientRect().width

    if (direction === -1) {
        testimonials.value.forEach((i) => (i.offset -= width))
        testimonials.value[leftIndex.value].offset += testimonials.value.length * width

        leftIndex.value += 1
        rightIndex.value += 1

        if (leftIndex.value === testimonials.value.length) leftIndex.value = 0
        if (rightIndex.value === testimonials.value.length) rightIndex.value = 0
    }

    if (direction === 1) {
        testimonials.value.forEach((i) => (i.offset += width))
        testimonials.value[rightIndex.value].offset -= testimonials.value.length * width

        rightIndex.value -= 1
        leftIndex.value -= 1

        if (rightIndex.value === -1) rightIndex.value = testimonials.value.length - 1
        if (leftIndex.value === -1) leftIndex.value = testimonials.value.length - 1
    }

    nextTick(() => applyClasses())

    if (window.innerWidth < 1000) {
        mobile.value = true
    }

    // Set up resize listener
    const resizeListener = () => {
        if (window.innerWidth < 1000) {
            mobile.value = true
        } else {
            mobile.value = false
        }
    }

    window.addEventListener("resize", resizeListener)

    // Clean up listener when the component is destroyed
    onBeforeUnmount(() => {
        window.removeEventListener("resize", resizeListener)
    })
}

function applyClasses() {
    if (!carousel.value) return

    testimonials.value.forEach((c, i) => {
        if (activeIndexes.value.includes(i)) {
            c.opacity = 1
        } else {
            c.opacity = 0
        }
    })
}
</script>

<style lang="scss" scoped>
.content {
    max-width: 1200px !important;
}

section {
    position: relative;
    background: $primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    padding-block: 75px 50px;
    padding-inline: 100px;
    color: white;

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        p {
            margin-top: 20px;
            max-width: 700px;
            font-size: 1rem;
        }

        h2 {
            font-size: 2.5rem;
        }

        h4 {
            color: $primary;
            position: relative;

            &::before {
                content: "";
                background: $primary;
                height: 1px;
                width: 50px;

                top: 50%;
                position: absolute;
                right: -60px;
                transform: translateY(-50%);
            }

            &::after {
                content: "";
                background: $primary;
                height: 1px;
                width: 50px;

                top: 50%;
                position: absolute;
                left: -60px;
                transform: translateY(-50%);
            }
        }
    }
}

.carousel-container {
    display: flex;
    flex-direction: column;

    .controls {
        display: flex;
        margin-inline: auto;
        gap: 10px;

        button {
            display: flex;
            justify-content: center;
            align-items: center;

            border: none;
            color: black;
            border-radius: 5px;
            height: 40px;
            width: 40px;
            cursor: pointer;

            &:active {
                transform: translate(1px, 1px);
            }
        }
    }

    .carousel {
        overflow-x: hidden;
        display: flex;
        padding-block: 50px 50px;
        justify-content: flex-start;

        .carousel-card {
            opacity: 0;

            display: flex;
            flex-direction: column;
            gap: 0px;
            min-width: 300px;
            margin-inline: 10px;
            width: 300px;
            max-width: 300px;
            background-color: white;
            border-radius: 5px;
            color: black;
            padding: 25px 0;
            height: min-content;
            font-size: 1.1rem;
            transition:
                transform 0.4s,
                opacity 0.2s;

            .text {
                max-height: 400px;
                overflow-y: auto;
                font-size: 1.15rem;
                line-height: 1.4;
                padding-inline: 25px;
            }

            .stars {
                padding-inline: 25px;
                margin-top: 20px;
            }

            h6 {
                padding-inline: 25px;
                font-size: 1.1rem;
            }

            &.active {
                opacity: 1;
            }
        }
    }
}

.gold-rectangle {
    &.r-1 {
        top: -40px;
        left: 50px;
        z-index: -1;
    }

    &.r-2 {
        top: -65px;
        left: 115px;
        z-index: -1;
    }

    &.r-3 {
        bottom: -25px;
        right: 50px;
    }

    &.r-4 {
        bottom: -50px;
        right: 115px;
    }
}

@media (max-width: 550px) {
    section {
        padding-inline: 50px;
    }

    .r-3,
    .r-4 {
        display: none;
    }
}
</style>
