<template>
    <main v-if="quote" class="quote">
        <header>
            <div style="background-color: #081c44" class="blue-logo-box">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/cw-logo.webp?alt=media&token=8572be88-d5f1-4c58-9c0e-2ef76b5a185a"
                    alt=""
                />
            </div>
            <div>
                <h1>Project Quote</h1>
                <h2>codywakeford.com</h2>
            </div>
        </header>

        <article>
            <section>
                <h3>Overview</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in quote.items">
                            <td>{{ item.name }}</td>
                            <td>{{ item.paymentType }}</td>
                            <td>£{{ item.unitPrice }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>£{{ item.subtotal }}</td>
                        </tr>

                        <tr class="empty-row" v-for="_ in 9 - quote.items.length">
                            <td></td>
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
                            <td>0</td>
                            <td>0</td>
                            <td>£{{ quote.items.reduce((sum, item) => item.subtotal + sum, 0) }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="garuntee">
                <h3>My Service Garuntee</h3>

                <p>I provide free bug fixes for 30 days after project completion to ensure everything runs smoothly.</p>
                <p>
                    Before anything is released to the public all code is end-to-end tested using industry best practices, this ensures your website works
                    seamlessly and without error on all devices.
                </p>
                <p>All my websites are 100% mobile responsive.</p>
                <p>All my clients get a google analytics hooked up to their website for free.</p>
                <p>Every website I build comes with an independent Google Lighthouse performance report as a testament to my commitment to quality.</p>
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
import { Icon } from "@iconify/vue"
import { useRoute } from "vue-router"

definePageMeta({
    layout: "empty",
})

const route = useRoute()
const quote = ref<Quote | null>(null)

if (route.query.quote) {
    try {
        quote.value = JSON.parse(route.query.quote as string)
    } catch (e) {
        console.error("Invalid JSON in query parameter:", e)
        quote.value = null
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
}

tbody {
    font-size: 0.7rem;
}

p {
    margin: 0;
    padding-bottom: 10px;
    font-size: 0.9rem;
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
