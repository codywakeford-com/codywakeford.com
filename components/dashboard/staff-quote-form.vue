<template>
    <section>
        <div class="quote-form">
            <div class="form-item">
                <label for="">Name</label>
                <input type="text" v-model="newQuoteItem.name" />
            </div>

            <div class="form-item">
                <label for="">Quantity</label>
                <input type="text" v-model="newQuoteItem.quantity" />
            </div>

            <div class="form-item">
                <label for="">Unit Price</label>
                <input type="text" v-model="newQuoteItem.unitPrice" />
            </div>

            <div class="item" v-for="(item, index) in quoteItems">
                <div>Item: {{ item.name }}</div>
                <div>Quantity: {{ item.quantity }}</div>
                <div>Unit Price: {{ item.unitPrice }}</div>
                <button @click="removeQuoteItem(index)">Delete</button>
            </div>

            <button @click="addQuoteItem()">Add item</button>
        </div>
        <button @click="createQuoteDoc()">make doc</button>
        {{ quoteUrl }}

        <nuxt-link v-if="quoteUrl" :to="quoteUrl">Download Quote</nuxt-link>
        <nuxt-link v-if="invoiceUrl" :to="invoiceUrl">Download Invoice</nuxt-link>

        <button v-if="quoteUrl" @click="$Projects.addQuoteToProject(projectId)">Upload Quote</button>

        {{ invoiceUrl }}
        {{ quoteUrl }}
    </section>
</template>

<script setup lang="ts">
import { uuid } from "~/utils/uuid"

const quoteItems = ref<QuoteItem[]>([])
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

interface Props {
    projectId: string
}

const props = defineProps<Props>()

async function createQuoteDoc() {
    const total = quoteItems.value.reduce((sum: number, item: QuoteItem) => {
        return sum + item.subtotal
    }, 0)

    const quote: Quote = {
        id: uuid(),
        discount: 0,
        items: quoteItems.value,
        projectId: props.projectId,
        timestamp: Date.now(),
        currency: "gbp",

        taxRate: 0,
        status: "sent",
        totalAmount: total,
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

    $Projects.total = total
    $Projects.quoteUrl = quoteUrl.value
}

function removeQuoteItem(i: number) {
    quoteItems.value.splice(i, 1)
}
</script>

<style lang="scss" scoped>
section {
    display: flex;
    flex-direction: column;
}

.quote-form {
    display: flex;
    flex-direction: column;
}
</style>
