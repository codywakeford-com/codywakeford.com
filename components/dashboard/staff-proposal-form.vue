<template>
    <section>
        <h2>Project Proposal</h2>
        <div class="form-item">
            <label for="">Scope Of Work</label>
            <textarea name="" rows="15" v-model="input.scope" id=""></textarea>
        </div>

        <div class="form-item">
            <label for="">Number Days Work</label>
            <input type="text" v-model="input.nDaysWork" />
        </div>

        <div class="form-item">
            <label for="">Due Date</label>
            <input type="text" v-model="input.due" />
        </div>

        <div class="form-item">
            <label for="">Deliverable</label>
            <input type="text" v-model="deliverableInput" />
            <button @click="addItem(deliverableInput)">Add Item</button>
        </div>

        <div class="item" v-for="(item, index) in input.deliverables">
            {{ item }} <button @click="removeItem(index)">Remove</button>
        </div>

        <button @click="generateProposal()">Generate Proposal</button>
    </section>
    <embed v-if="url" :src="url" type="application/pdf" />
</template>

<script setup lang="ts">
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
interface Props {
    projectId: Project["id"]
}
const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
section {
    background: lightgrey;
    padding: 25px;
    width: 500px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

h2 {
    margin-bottom: 15px;
}

embed {
    height: 500px;
    width: 350px;
}
</style>
