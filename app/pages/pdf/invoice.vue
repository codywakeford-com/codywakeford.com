<template>
    <main v-if="data">
        <header>
            <div style="background-color: #081c44" class="blue-logo-box">
                <img src="https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/cw-logo.webp?alt=media&token=8572be88-d5f1-4c58-9c0e-2ef76b5a185a"
                    alt="" />
            </div>
            <div>
                <h1>Invoice</h1>
                <nuxt-link to="https://codywakeford.com">
                    <h2>codywakeford.com</h2>
                </nuxt-link>
            </div>
        </header>

        <article>
            <div class="flex">
                <div class="flex-col">
                    <section>
                        <h3>Issued To</h3>
                        <p>{{ data.recipientName }}</p>
                        <p v-if="data.company">{{ data.company }}</p>
                        <p>{{ dayjs(Date.now()).format("dddd Do MMM HH:mma") }}</p>
                    </section>
                </div>
                <section>
                    <h3>Pay To</h3>
                    <h5>Natwest Bank</h5>

                    <div class="grid">
                        <div class="left">
                            <div>Name:</div>
                            <div>Account Number:</div>
                            <div>Sort Code:</div>
                        </div>

                        <div class="right">
                            <div>Mr Cody Wakeford</div>
                            <div>60704497</div>
                            <div>60-02-09</div>
                        </div>
                    </div>

                    <!-- <h5>Or pay through my website</h5> -->
                    <!-- <nuxt-link to="https://codywakeford.com/payments">https://codywakeford.com/payments</nuxt-link> -->
                </section>
            </div>
            <section>
                <h3>Overview</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in data.quote.items">
                            <td>{{ item.name }}</td>
                            <td>£{{ item.unitPrice }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>£{{ item.subtotal }}</td>
                        </tr>

                        <tr class="empty-row" v-for="_ in 7 - data.quote.items.length">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="cost-breakdown">
                <h3>Cost Breakdown</h3>
                <table>
                    <thead>
                        <tr>
                            <th>VAT %</th>
                            <th>Discount %</th>
                            <th>Grand Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{{ data.quote.taxRate || 0 }}</td>
                            <td>{{ data.quote.discount || 0 }}</td>
                            <td>£{{ data.quote.items.reduce((sum, item) => item.subtotal + sum, 0) }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h3>Thank you for your business</h3>
            </section>
        </article>

        <div class="contact-details">
            <div class="item">
                <Icon icon="material-symbols:mail" width="20" />
                <h3>codypwakeford@gmail.com</h3>
            </div>

            <div class="item">
                <Icon icon="bi:telephone-fill" width="15" />
                <h3>07560068765</h3>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { Icon } from "@iconify/vue"
import { useRoute } from "vue-router"

import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

definePageMeta({
    layout: "empty",
})

const route = useRoute()

// const data: Data = {
//     recipientName: "John Doe",
//     quote: {
//         id: "quote_12345",
//         items: [
//             {
//                 name: "Web Development",
//                 paymentType: "single",
//                 description: "Custom website development",
//                 quantity: 1,
//                 unitPrice: 500000, // £5000 in pence
//                 subtotal: 500000,
//             },
//             {
//                 name: "SEO Optimization",
//                 paymentType: "monthly",
//                 description: "Ongoing SEO services",
//                 quantity: 3, // 3 months
//                 unitPrice: 20000, // £200 in pence
//                 subtotal: 60000,
//             },
//         ],
//         timestamp: Date.now(),
//         projectId: "project_98765",
//         currency: "gbp",
//         taxRate: 20, // 20% VAT
//         status: "draft",
//         totalAmount: 560000, // 500000 + 60000 + tax
//         discount: 10, // 10% discount
//     },
// }

interface Data {
    quote: Quote
    recipientName: string
    company?: string
}

const data = ref<Data | null>(null)

function readCache() {
    const cache = localStorage.getItem("data")

    if (!cache) return null

    data.value = JSON.parse(cache)
}

if (route.query.data) {
    try {
        data.value = JSON.parse(route.query.data as string)
        console.log(data.value)
    } catch (e) {
        console.error("Invalid JSON in query parameter:", e)
        data.value = null
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

.grid {
    display: grid;
    grid-template-columns: 175px 1fr;
    font-size: 0.8rem;
    margin-bottom: 25px;

    .right {
        text-align: right;
    }
}

thead {
    background: #efefef;
    font-size: 0.8rem;
}

tbody {
    font-size: 0.7rem;
}

a,
p {
    margin: 0;
    padding-bottom: 3px;
    font-size: 0.8rem;
}

.flex {
    display: flex;
    justify-content: space-between;
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
    padding-block: 50px 0;
}

.empty-row {
    height: 30px !important;
}

h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
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
    padding-inline: 100px;
}
</style>
