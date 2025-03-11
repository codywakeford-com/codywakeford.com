<template>
    <mpage>
        <main class="staff-main-form">
            <form-kit type="form" @submit.prevent="submit()">
                <header class="form-header">
                    <h1>Build Client Quote</h1>
                    <p>Here we can generate a client quote and project proposal pdf to be sent over.</p>
                </header>

                <h2>Project Proposal</h2>

                <form-kit
                    type="textarea"
                    rows="11"
                    label="Scope of Work"
                    help="Please explain your understanding of the clients requiremnts. This helps clear up any misunderstandings before the quote is accepted."
                    validation="required"
                />

                <div class="input-row">
                    <form-kit type="text" label="Number of Days Work" validation="required" v-model="input.nDaysWork" />
                    <form-kit type="date" label="Due Date" validation="required" v-model="input.due" />
                </div>

                <header class="sub-heading">
                    <h3>Deliverables</h3>
                    <p class="form-p">A list of tangible items for the project.</p>
                </header>

                <FormKit
                    type="list"
                    :value="['']"
                    dynamic
                    #default="{ items, node, value }"
                    validation="list_length:2|required"
                    :config="{ validation: 'required' }"
                >
                    <div class="input-row">
                        <FormKit
                            v-for="(item, index) in items"
                            :key="item"
                            :index="index"
                            label="Deliverables"
                            @suffix-icon-click="() => node.input(value.filter((_, i) => i !== index))"
                        />

                        <button class="remove-button"><Icon name="material-symbols:delete" /></button>
                    </div>

                    <button type="button" class="add-another-button" @click="() => node.input(value.concat(''))">
                        <span>Add another item</span>
                        <Icon name="material-symbols:add-rounded" />
                    </button>
                </FormKit>

                <header class="sub-heading">
                    <h3>Quote</h3>
                    <p class="form-p">A list of quote items for the project.</p>
                </header>

                <FormKit
                    type="list"
                    :value="[{}]"
                    dynamic
                    #default="{ items, node, value }"
                    :config="{ validation: 'required' }"
                >
                    <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index">
                        <div class="input-row">
                            <form-kit type="text" name="name" label="Item Name" />
                            <form-kit name="quantity" type="text" label="Quantity" />
                            <form-kit name="unitPrice" type="text" label="Unit Price" />
                            <button
                                type="button"
                                @click="() => node.input(value.filter((_, i) => i !== index))"
                                class="remove-button"
                            >
                                <Icon name="material-symbols:delete" />
                            </button>
                        </div>
                    </FormKit>

                    <button type="button" class="add-another-button" @click="() => node.input(value.concat({}))">
                        <span>Add another item</span>
                        <Icon name="material-symbols:add-rounded" />
                    </button>
                </FormKit>

                <div class="total">Total £{{ total }}</div>

                <!-- <embed v-if="quoteUrl" :src="quoteUrl" type="application/pdf" /> -->
                <!-- <embed v-if="proposalUrl" :src="proposalUrl" type="application/pdf" /> -->
                <!-- <embed v-if="invoiceUrl" :src="invoiceUrl" type="application/pdf" /> -->
                <!---->
                <!-- <button -->
                <!--     type="button" -->
                <!--     v-if="projectId && quoteUrl" -->
                <!--     @click="ProjectController.addQuoteToProject(projectId, quoteUrl, proposalUrl, total)" -->
                <!-- > -->
                <!--     Upload Quote To Project -->
                <!-- </button> -->
                <!-- <button-primary-m :disabled="loading" type="submit"> -->
                <!--     {{ loading ? "Loading" : "Generate Documents" }} -->
                <!-- </button-primary-m> -->

                <template #submit>
                    <button type="submit" class="submit-button" :disabled="loading">
                        <loader v-if="loading" color="white" />
                        <span v-else>Submit</span>
                    </button>
                </template>
            </form-kit>
        </main>
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

const quoteUrl = ref<null | string>(null)
const invoiceUrl = ref<null | string>(null)

const quoteItems = ref([])
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

const loading = ref(false)

async function submit() {
    loading.value = true

    const { quoteDocUrl, invoiceDocUrl, proposalDocUrl } = await PdfController.generateQuoteAndProposal(
        $Projects.state.selectedProjectId,
        quoteItems.value,
        total.value * 100,
        "name",
        input.value.scope,
        input.value.nDaysWork,
        input.value.due,
        input.value.deliverables,
    )

    if (quoteDocUrl) {
        quoteUrl.value = quoteDocUrl
    }

    if (invoiceDocUrl) {
        invoiceUrl.value = invoiceDocUrl
    }

    if (proposalDocUrl) {
        proposalUrl.value = proposalDocUrl
    }

    loading.value = false
}
</script>

<style scoped lang="scss">
@use "@/style/forms.scss" as *;

embed {
    min-height: 400px;
}
</style>
