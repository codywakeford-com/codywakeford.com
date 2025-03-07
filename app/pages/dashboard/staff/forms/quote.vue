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

                <button-primary-m class="submit-button" @click="addQuoteItem()">Add item</button-primary-m>

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
            </div>

            <embed v-if="quoteUrl" :src="quoteUrl" type="application/pdf" />

            <nuxt-link v-if="quoteUrl" :to="quoteUrl">Download Quote</nuxt-link>
            <nuxt-link v-if="invoiceUrl" :to="invoiceUrl">Download Invoice</nuxt-link>
            {{ projectId }}
            <button v-if="projectId && quoteUrl" @click="ProjectController.addQuoteToProject(projectId, quoteUrl, proposalUrl, total)">Upload Quote</button>
            <button-primary-m type="submit">Submit</button-primary-m>
        </form>
    </mpage>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.query.projectId as string | null

definePageMeta({
    layout: "dashboard",
    middleware: "staff-dashboard",
})
const proposalUrl = ref("")
import PdfController from "~~/controllers/PdfController"
import ProjectController from "~~/controllers/ProjectsController"

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

    const { quoteDocUrl, invoiceDocUrl, proposalDocUrl } = await PdfController.generateQuoteAndProposal(
        $Projects.state.selectedProjectId,
        quoteItems.value,
        total.value,
        "name",
    )

    if (quoteDocUrl) {
        quoteUrl.value = quoteDocUrl
    }

    loading.value = false
}

function removeQuoteItem(i: number) {
    quoteItems.value.splice(i, 1)
}
</script>

<style scoped lang="scss">
@use "@/style/forms.scss" as *;

embed {
    min-height: 400px;
}
</style>
