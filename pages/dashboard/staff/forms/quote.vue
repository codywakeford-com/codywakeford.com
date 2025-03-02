<template>
    <mpage>
        <form @submit.prevent="submit()" class="main-form">
            <header>
                <h1>Build Client Quote</h1>
                <p>Here we can generate a client quote and project proposal pdf to be sent over.</p>
            </header>

            <h2>Project Proposal</h2>

            <div class="input-group">
                <label for="">Scope Of Work</label>
                <textarea name="" rows="15" v-model="input.scope" id=""></textarea>
            </div>

            <div class="input-row">
                <div class="input-group">
                    <label for="">Number Days Work</label>
                    <input type="text" v-model="input.nDaysWork" />
                </div>

                <div class="input-group">
                    <label for="">Due Date</label>
                    <input type="text" v-model="input.due" />
                </div>

                <div class="input-group">
                    <label for="">Deliverable</label>
                    <input type="text" v-model="deliverableInput" />
                    <button @click="addItem(deliverableInput)">Add Item</button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Deliverable</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) of input.deliverables">
                        <td>{{ item }}</td>
                        <td>
                            <button @click="removeQuoteItem(index)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Quote</h2>
            <div class="quote-form">
                <div class="input-row">
                    <div class="input-group">
                        <label for="">Item Name</label>
                        <input type="text" v-model="newQuoteItem.name" />
                    </div>

                    <div class="input-group">
                        <label for="">Quantity</label>
                        <input type="text" v-model="newQuoteItem.quantity" />
                    </div>

                    <div class="input-group">
                        <label for="">Unit Price</label>
                        <input type="text" v-model="newQuoteItem.unitPrice" />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of quoteItems">
                            <td>{{ item.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>£{{ item.unitPrice }}</td>
                            <td>
                                <button @click="removeQuoteItem(index)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="total">Total £{{ total }}</div>

                <button-primary-m class="submit-button" @click="addQuoteItem()">Add item</button-primary-m>
            </div>

            <nuxt-link v-if="quoteUrl" :to="quoteUrl">Download Quote</nuxt-link>
            <nuxt-link v-if="invoiceUrl" :to="invoiceUrl">Download Invoice</nuxt-link>

            <button v-if="quoteUrl" @click="$Projects.addQuoteToProject(projectId)">Upload Quote</button>
        </form>
    </mpage>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})

import { uuid } from "~/utils/uuid"

const quoteItems = ref<QuoteItem[]>([
    {
        name: "Item 1",
        unitPrice: 1166,
        quantity: 1,
        subtotal: 1166,
        paymentType: "single",
    },
    {
        name: "Item 1",
        unitPrice: 1166,
        quantity: 1,
        subtotal: 1166,
        paymentType: "single",
    },
    {
        name: "Item 1",
        unitPrice: 1166,
        quantity: 1,
        subtotal: 1166,
        paymentType: "single",
    },
])
const quoteUrl = ref<null | string>(null)
const invoiceUrl = ref<null | string>(null)
const newQuoteItem = ref<QuoteItem>({
    name: "",
    quantity: 0,
    unitPrice: 0,
    paymentType: "single",
    get subtotal() {
        return this.quantity * this.unitPrice
    },
})
function addQuoteItem() {
    for (let value of Object.values(newQuoteItem.value)) {
        if (!value) return
    }

    quoteItems.value.push(newQuoteItem.value)

    newQuoteItem.value = {
        name: "",
        quantity: 0,
        unitPrice: 0,
        paymentType: "single",

        get subtotal() {
            return this.quantity * this.unitPrice
        },
    }
}
const total = computed(() => {
    return quoteItems.value.reduce((sum: number, item: QuoteItem) => {
        return sum + item.subtotal
    }, 0)
})

interface Props {
    projectId: string
}

const url = ref("")
const deliverableInput = ref("")
const input = ref<Proposal>({
    scope: "This project aims to design and develop a responsive website for the client. The website will include an e-commerce platform with product listing, cart functionality, and payment gateway integration.",
    nDaysWork: 21,
    due: "March 2nd 2025",
    deliverables: ["Home Page", "About Page"],
})

function addItem(item: string) {
    if (!deliverableInput.value) return
    input.value.deliverables.push(item)
    deliverableInput.value = ""
}

function removeItem(index: number) {
    input.value.deliverables.splice(index, 1)
}

const loading = ref(false)
async function submit() {
    loading.value = true
    try {
        const promises = [generateProposal(), createQuoteDoc()]
        await Promise.all(promises)
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = true
    }
}
async function generateProposal() {
    for (let a of Object.entries(deliverableInput.value)) {
        if (!a) return
    }

    url.value = await $fetch(`/api/pdf/proposal`, {
        method: "POST",
        body: input.value,
    })

    $Projects.proposalUrl = url.value
}
const props = defineProps<Props>()

async function createQuoteDoc() {
    const quote: Quote = {
        id: uuid(),
        discount: 0,
        items: quoteItems.value,
        projectId: props.projectId,
        timestamp: Date.now(),
        currency: "gbp",

        taxRate: 0,
        status: "sent",
        totalAmount: total.value,
    }

    quoteUrl.value = (await $fetch("/api/pdf/quote", {
        method: "POST",
        body: {
            quote,
            recipientName: "Name Here",
        },
    })) as string

    invoiceUrl.value = (await $fetch("/api/pdf/invoice", {
        method: "POST",
        body: {
            quote,
            recipientName: "Johnny Parker",
        },
    })) as string

    $Projects.total = total.value
    $Projects.quoteUrl = quoteUrl.value
}

function removeQuoteItem(i: number) {
    quoteItems.value.splice(i, 1)
}
</script>

<style scoped lang="scss">
@use "@/style/forms.scss" as *;
</style>
