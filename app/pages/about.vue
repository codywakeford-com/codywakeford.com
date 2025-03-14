<script setup lang="ts">
const items = [
    {
        header: "From Code Monkey to Freelance Maestro",
        para: [
            "Hi, I'm Cody Wakeford, a seasoned website developer with years of experience in the industry. After honing my skills and gaining valuable insights while working with various organizations, I recently took the exciting plunge into freelance development. This new venture allows me to bring my expertise directly to clients, offering customized web solutions that cater to their unique needs.",
        ],
    },
    {
        header: "Crafting Pixels with Purpose",
        para: [
            "Throughout my career, I've had the opportunity to work on a diverse range of projects, from sleek corporate websites to dynamic e-commerce platforms. My goal is to leverage this experience to help businesses of all sizes establish a strong online presence and achieve their digital objectives. I believe that every pixel should have a purpose and every line of code should bring your vision to life.",
        ],
    },
    {
        header: "The Skills to Pay the Bills",
        para: [
            "My technical toolkit includes HTML, CSS, JavaScript, Vue.js, Nuxt.js, Typescript, Python and Node.js, among others. But I don't just stop at the technical stuff. I have a strong background in UI/UX design, ensuring that the websites I build are not only functional but also visually appealing and user-friendly. Because let’s face it, a good-looking website makes the internet a better place for everyone.",
        ],
    },

    {
        header: "Coding by Hand: The Art of Control and Optimization",
        para: [
            "I choose to code websites by hand because it gives me complete control over every aspect of the project. Unlike using page builders, which can limit customization and optimization, hand-coding allows me to write clean, efficient, and optimized code tailored specifically to the needs of the website. This hands-on approach ensures that every element is built to perform at its best, with no unnecessary bloat or restrictions.",
            "In addition, I have developed workflows and automated processes that enable me to be incredibly efficient in my development. These workflows help streamline repetitive tasks, allowing me to focus on delivering high-quality, well-optimized websites. The autonomy I have when coding by hand not only enhances my creativity but also empowers me to create truly unique and scalable solutions for my clients.",
        ],
    },
    {
        header: "From Code to Design: Crafting Beautiful Websites",
        para: [
            "I started coding at a young age, fascinated by the logic and problem-solving aspects of programming. This early exposure gave me a strong technical foundation, which I built upon over the years. However, as I advanced in my development journey, I realized that creating something truly impactful goes beyond just writing code – it’s about making it beautiful, intuitive, and engaging.",
            "This realization led me to explore design, where I could merge my technical skills with creativity. By learning the principles of UI/UX design, I discovered how to create websites that not only function perfectly but also deliver a visually compelling experience. Today, I’m proud to combine both worlds – the precision of coding and the artistry of design – to build websites that are both technically robust and visually stunning.",
        ],
    },
    {
        header: "Beyond the Screen",
        para: [
            "When I'm not coding, you can find me exploring the latest tech trends, attending web development meetups, or working on open-source projects. I'm passionate about continuous learning and staying at the forefront of web development innovations. This passion translates into high-quality work for my clients, keeping their websites fresh and ahead of the curve.",
            "Outside the digital realm, I love to stay active. Living in the picturesque Peak District, I take full advantage of the stunning landscape by going mountain biking and hiking. These activities not only keep me fit but also inspire my creativity and problem-solving skills. Additionally, I enjoy boxing, which helps me maintain focus and discipline – qualities that I bring to my professional work.",
            "Of course, no coder's life is complete without a passion for programming and a good cup of coffee. I often spend my free time experimenting with new programming languages and technologies, fueled by my love for coffee. This combination of physical activity, continuous learning, and caffeine keeps me energized and ready to tackle any web development challenge that comes my way.",
        ],
    },
    {
        header: "Why Choose Me?",
        para: [
            "What sets me apart is my dedication to understanding my clients' unique needs and translating them into effective digital solutions. With a business-minded approach, I can put myself in your customers' shoes to deliver exactly what you need. I am adept at user experience design, bringing you a website that is intuitive to use and great looking. I always work hard to create a website that performs exceptionally well and can offer the up-to-date guidance on web-related technology.",
            "I can build custom in-house software and provide a one-stop shop for all your web services. Whether you need a simple landing page or a complex web application, I am committed to delivering a product that exceeds your expectations. Plus, I bring a sprinkle of creativity and a dash of fun to every project – because who says web development has to be boring?",
        ],
    },
    {
        header: "Happy Clients, Happy Life",
        para: [
            "My clients' satisfaction is my top priority. I take a client-centered approach, working closely with each business to understand their unique needs and objectives. My goal is to leave every client with a high-quality website that not only meets their expectations but also enhances their online presence.",
            "By focusing on user experience and visual appeal, I create websites that are intuitive to navigate and attractive to potential customers. This helps businesses improve their reach and engagement, ultimately driving growth and success. Whether it's through a stunning design, seamless functionality, or robust performance, I strive to deliver a final product that my clients are proud to showcase.",
        ],
    },
    {
        header: "Let's Create Something Amazing",
        para: [
            "If you're looking for a web developer who can bring your vision to life and make the internet a better, more user-friendly place, feel free to. Let's build something great together!",
        ],
    },
]

const visibleItemIds = ref<string[]>([])

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleItemIds.value.push(entry.target.id)
            } else {
                visibleItemIds.value = visibleItemIds.value.filter((id) => id !== entry.target.id)
            }
        })
    },
    {
        threshold: 0.5,
    },
)

onMounted(() => {
    const itemsToObserve = document.querySelectorAll(".item")
    itemsToObserve.forEach((item) => observer.observe(item))
})

onBeforeUnmount(() => {
    observer.disconnect()
})
</script>

<template>
    <sub-hero>About</sub-hero>

    <article>
        <content>
            <section-sub-header color="dark" class="sub-header">
                <template #sub>RELIABLE</template>
                <template #header>Learn some more about who your working with</template>
            </section-sub-header>

            <div class="flex">
                <div class="left">
                    <div class="item" :id="item.header.replace(/ /g, '-').toLowerCase()" v-for="item of items">
                        <h3>{{ item.header }}</h3>
                        <p v-for="p of item.para">{{ p }}</p>
                    </div>
                </div>

                <div class="sticky-container">
                    <div class="sticky-content">
                        <nuxt-link
                            :class="{ active: visibleItemIds.includes(p.header.replace(/ /g, '-').toLowerCase()) }"
                            :to="`/about#${p.header.replace(/ /g, '-').toLowerCase()}`"
                            v-for="p of items"
                        >
                            {{ p.header }}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </content>
    </article>
    <contact />
</template>

<style scoped lang="scss">
main,
html,
body {
    scroll-padding-top: 200px;
}

article {
    padding-bottom: 50px;
}
.sub-header {
    padding-block: 50px 75px;
}
.item {
    padding-block: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
        line-height: 1.7;
        opacity: 0.95;
        margin-bottom: 10px;
    }
}

.sticky-container {
    position: relative;
}

.sticky-content {
    position: sticky;
    top: 150px;

    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 300px;

    a {
        cursor: pointer;

        &:hover {
            color: var(--primary);
            font-weight: bold;
            text-decoration: underline;
        }

        &.active {
            color: var(--primary);
            font-weight: bold;
        }
    }
}

@media (max-width: 1000px) {
    .sticky-container {
        display: none !important;
    }
}
</style>
