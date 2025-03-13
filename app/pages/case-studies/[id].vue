<script setup lang="ts">
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

interface Case {
    id: string
    name: string
    images: string[]
    description: string
    keyFeatures: string[]
    websiteUrl?: string
}

const cases: Case[] = [
    {
        id: "primeproperty",
        name: "Prime Property",
        images: ["/assets/", "/assets/", "/assets/", "/assets/", "/assets/"],
        description:
            "For Prime Property, a leading Spanish property agency, I designed and developed a fully customized website tailored to showcase their portfolio of properties for sale, rent, and investment opportunities across Spain. The website serves as an informative and user-friendly platform that helps potential buyers and renters easily find their ideal properties, while also giving the agency the tools to manage and update listings seamlessly.",
        keyFeatures: [
            "Admin Dashboard",
            "Live Updates",
            "Property Listings with Filters",
            "Advanced Search (Price, Location, Type)",
            "Interactive Property Map",
            "Property Detail Pages with Images, Floor Plans, and Videos",
            "Contact Forms for Inquiries",
            "SEO Optimization for Listings",
            "Mobile-Friendly Design",
            "Customizable Property Categories",
            "Analytics Dashboard for Admins",
            "Property Price Estimation Tool",
            "Multi-Language Support",
        ],

        websiteUrl: "https://primeproperty.codywakeford.com",
    },
    {
        id: "bean-and-brew",
        name: "Bean and Brew",
        images: ["/bean-and-brew.webp"],
        description:
            "For Bean and Brew, a cozy and welcoming coffee shop, I designed and developed a sleek, one-page website that captures the essence of their coffee culture. The website serves as an easy-to-navigate platform for coffee enthusiasts to explore the shop's menu, learn about their unique coffee blends, and connect with the brand. With a focus on simplicity and high-quality imagery, the website offers an inviting space for customers to discover promotions, place orders, and find the shop's location. The mobile-friendly design ensures that customers can easily access the site from any device, making it a go-to resource for coffee lovers on the go.",
        keyFeatures: [
            "Responsive Design",
            "Simple Navigation for Easy Browsing",
            "High-Quality Coffee Imagery",
            "About Us Section with Brand Story",
            "Menu with Coffee Options & Descriptions",
            "Social Media Links for Easy Sharing",
            "SEO Optimization for Search Visibility",
            "Fast Load Times with Minimalistic Design",
            "Custom Coffee-Themed Design Elements",
        ],
        websiteUrl: "https://primeproperty.codywakeford.com",
    },
]
</script>
<template>
    <main>
        <sub-hero>{{ c.name }}</sub-hero>

        <article>
            <content>
                <div class="flex">
                    <div class="sticky-container">
                        <div class="sticky-content">
                            <h2>{{ c.name }}</h2>
                            <p>{{ c.description }}</p>

                            <ul>
                                <li v-for="i of c.keyFeatures">{{ i }}</li>
                            </ul>
                            <nuxt-link v-if="c.websiteUrl" :to="c.websiteUrl">Live Website</nuxt-link>

                            <div class="pages-button-group" v-if="c.images.length - 1">
                                <button v-for="(i, index) of c.images" @click="selectedImage = index">
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
}
.pages-button-group {
    display: flex;
    gap: 1px;
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;

    button {
        padding: 3px 15px;
        background: var(--primary);
        color: var(--text1);
        font-weight: bold;
    }
}
.image-col {
    background: var(--text2);
    min-width: 600px;
    max-width: 600px;
    flex: 1;

    img {
        max-width: 600px;
    }
}
</style>
