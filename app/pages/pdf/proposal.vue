<template>
    <main v-if="proposal" class="quote">
        <header>
            <div style="background-color: #081c44" class="blue-logo-box">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/cw-logo.webp?alt=media&token=8572be88-d5f1-4c58-9c0e-2ef76b5a185a"
                    alt=""
                />
            </div>
            <div>
                <h1>Project Proposal</h1>
                <h2>codywakeford.com</h2>
            </div>
        </header>

        <article>
            <section>
                <h3>Overview</h3>
                <p>
                    This document outlines my understanding of your project requirements to ensure we are aligned on the
                    scope, objectives, and deliverables. It serves as a reference point to keep expectations clear and
                    ensure a smooth development process.
                </p>
            </section>

            <section>
                <h3>Scope of work</h3>
                <p>{{ proposal.scope }}</p>
            </section>

            <section>
                <h3>Key Deliverables</h3>
                <ol>
                    <li v-for="item of proposal.deliverables">{{ item }}</li>
                </ol>

                <p>
                    As part of my standard development process, your website will be fully mobile-responsive, rigorously
                    tested, and optimized to ensure all features function as intended.
                </p>
            </section>

            <section>
                <h3>Timeline & Milestones</h3>
                <p>
                    As outlined in the quote, the estimated time for completion is
                    {{ proposal.nDaysWork }} days. I will ensure the website is fully delivered and handed over by
                    {{ proposal.due }}.
                </p>
            </section>

            <section>
                <h3>Payment Structure</h3>
                <p>
                    To ensure a smooth workflow and mutual commitment throughout the project, payments will be
                    structured in three stages:
                </p>

                <ul>
                    <!-- <li> -->
                    <!--   Initial Payment (33%) – Due upfront to secure the project and begin -->
                    <!--   research, planning, and initial design concepts. -->
                    <!-- </li> -->

                    <!-- <li> -->
                    <!--   Design Milestone (33%) – Paid once the design phase is completed and -->
                    <!--   approved, before moving into full development. -->
                    <!-- </li> -->

                    <!-- <li> -->
                    <!--   Final Payment (34%) – Due upon project completion, after final -->
                    <!--   testing and deployment. -->
                    <!-- </li> -->

                    <li>Initial Payment (50%) – Due upfront to secure the project.</li>

                    <li>Final Payment (50%) – Due upon project completion, after final testing and deployment.</li>
                </ul>
            </section>
        </article>

        <div class="contact-details">
            <div class="item">
                <Icon icon="material-symbols:mail" width="20" />
                <h3>cody@codywakeford.com</h3>
            </div>

            <div class="item">
                <Icon icon="bi:telephone-fill" width="15" />
                <h3>07560068765</h3>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useRoute } from "vue-router"

definePageMeta({
    layout: "empty",
})

const route = useRoute()
const proposal = ref<Proposal | null>(null)

if (route.query.data) {
    try {
        proposal.value = JSON.parse(route.query.data as string)
        console.log(proposal.value)
    } catch (e) {
        console.error("Invalid JSON in query parameter:", e)
        proposal.value = null
    }
}
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

tbody tr:nth-child(even) {
    background: #efefef;
}

tbody tr:nth-child(odd) {
    background: #f7f7f7;
}

thead {
    background: #efefef;
    font-size: 0.8rem;

    tr {
    }
}

tbody {
    font-size: 0.7rem;
}
li {
    margin: 0;
    font-size: 0.8rem;
    padding-bottom: 2px;
}
p {
    margin: 0;
    padding-bottom: 10px;
    font-size: 0.8rem;
}
th,
td {
    padding: 10px 50px 10px 20px;
    text-align: left;
    vertical-align: center;
    height: 20px;
}

h1,
h2,
h3 {
    margin: 0;
}

section {
    padding-block: 20px 0;
}
.empty-row {
    height: 30px !important;
}
h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
}
.contact-details {
    position: absolute;
    display: flex;
    gap: 50px;
    bottom: 9px;
    left: 100px;
    color: white;

    .item {
        display: flex;
        gap: 10px;
        align-items: center;

        h3 {
            font-size: 0.9rem;
            font-weight: 400;
            margin: 0;
        }
    }
}

.cost-breakdown table {
    width: fit-content;
}

main {
    border-top: 40px solid #081c44;
    border-bottom: 40px solid #081c44;
    height: calc(100% + 1px);
    //height: calc(100% - 50px);
}

.blue-logo-box {
    left: 75px;
    background-color: #081c44;
    height: 100%;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.blue-logo-box img {
    top: 0;
    right: 0;

    width: 75px;
    z-index: 5;
}

.blue-bar {
    background-color: #081c44;
    height: 50px;
}

header {
    height: 125px;
    display: flex;
    align-items: flex-end;
    padding-inline: 100px;
    gap: 50px;
    margin-bottom: 0px;
}

header h1 {
    font-size: 2.5rem;
}

header h2 {
    font-size: 1.25rem;
}

article {
    padding-block: 25px;
    padding-inline: 100px;
}
</style>
