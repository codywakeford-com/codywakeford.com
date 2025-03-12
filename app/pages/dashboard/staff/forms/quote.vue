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

const quoteUrl = ref<null | string>(null)
const invoiceUrl = ref<null | string>(null)

const input = ref({
    scope: "",
    nDaysWork: 0,
    due: "",
    deliverables: [""],
    quoteItems: [{}] as QuoteItem[],
})

const total = computed(() => {
    return input.value.quoteItems.reduce((sum: number, item: QuoteItem) => {
        return sum + item.subtotal * 100
    }, 0)
})

const loading = ref(false)

async function submit() {
    console.log("here")
    loading.value = true

    const { quoteDocUrl, invoiceDocUrl, proposalDocUrl } = await PdfController.generateQuoteAndProposal(
        $Projects.state.selectedProjectId,
        input.value.quoteItems,
        total.value,
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
