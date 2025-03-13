<template>
    <mpage>
        <main class="staff-main-form">
            <header class="form-header">
                <h1>Build Client Quote</h1>
                <p>Here we can generate a client quote and project proposal pdf to be sent over.</p>
            </header>

            <form-kit type="form" v-if="quoteUrl && proposalUrl" @submit="addQuoteToProject()">
                <div class="input-row">
                    <embed v-if="quoteUrl" :src="quoteUrl" type="application/pdf" />
                    <embed v-if="proposalUrl" :src="proposalUrl" type="application/pdf" />
                    <embed v-if="invoiceUrl" :src="invoiceUrl" type="application/pdf" />
                </div>

                <template #submit>
                    <div class="input-row">
                        <button type="submit" class="submit-button" :disabled="loading">
                            <loader v-if="loading" color="white" />
                            <span v-else>Submit</span>
                        </button>

                        <button type="button">Start Again</button>
                    </div>
                </template>
            </form-kit>

            <form-kit type="form" @submit="submit()" v-else>
                <h2>Project Proposal</h2>

                <form-kit
                    type="textarea"
                    rows="11"
                    label="Scope of Work"
                    help="Please explain your understanding of the clients requiremnts. This helps clear up any misunderstandings before the quote is accepted."
                    validation="required"
                    value="hello"
                />

                <div class="input-row">
                    <form-kit
                        type="text"
                        label="Number of Days Work"
                        validation="required"
                        value="default"
                        v-model="input.nDaysWork"
                    />
                    <form-kit type="date" label="Due Date" validation="required" value="default" v-model="input.due" />
                </div>

                <header class="sub-heading">
                    <h3>Deliverables</h3>
                    <p class="form-p">A list of tangible items for the project.</p>
                </header>

                <FormKit
                    type="list"
                    v-model="input.deliverables"
                    dynamic
                    #default="{ items, node, value }"
                    :config="{ validation: 'required' }"
                >
                    <div class="input-row">
                        <FormKit
                            v-for="(item, index) in items"
                            :key="item"
                            :index="index"
                            label="Deliverables"
                            value="hello"
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
                    v-model="input.quoteItems"
                    dynamic
                    #default="{ items, node, value }"
                    :config="{ validation: 'required' }"
                >
                    <FormKit type="group" v-for="(item, index) in items" :key="item" :index="index">
                        <div class="input-row">
                            <form-kit type="text" name="name" label="Item Name" />
                            <form-kit name="quantity" type="text" label="Quantity" />
                            <form-kit name="unitPrice" type="text" label="Unit Price" />
                            <form-kit
                                type="select"
                                name="paymentType"
                                label="Payment Type"
                                :values="['single', 'weekly', 'biweekly', 'monthly']"
                            />

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

                <template #submit>
                    <button type="submit" class="submit-button" :disabled="loading">
                        <loader v-if="loading" color="white" />
                        <span v-else>Submit</span>
                    </button>
                </template>
            </form-kit>

            <pre>

                {{ input }}
            </pre>
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

const input = ref({
    scope: "",
    nDaysWork: 7,
    due: "2025-03-27",
    deliverables: ["Home Page"],
    quoteItems: [
        {
            name: "Website Development",
            paymentType: "single",
            quantity: 3,
            unitPrice: 200,
            subtotal: 200,
        },
    ] as QuoteItem[],
})

const total = computed(() => {
    return input.value.quoteItems.reduce((sum: number, item: QuoteItem) => {
        return sum + item.subtotal * 100
    }, 0)
})

async function addQuoteToProject() {
    if (!quoteUrl.value || !invoiceUrl.value) return

    await ProjectController.submitQuoteAndProposal({})
}

const loading = ref(false)

async function submit() {
    if (!projectId) throw new Error("error")
    loading.value = true

    const { quote, invoice, proposal } = await PdfController.generateQuoteAndProposal({
        projectId: projectId,
        quoteItems: input.value.quoteItems,
        amount: total.value,
        recieptName: "Testing name",
        scope: input.value.scope,
        nDaysWork: input.value.nDaysWork,
        deliverables: input.value.deliverables,
        due: input.value.due,
    })

    if (quote.previewUrl) {
        quoteUrl.value = quote.previewUrl
    }

    if (invoice.previewUrl) {
        invoiceUrl.value = invoice.previewUrl
    }

    if (proposal.previewUrl) {
        proposalUrl.value = proposal.previewUrl
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
