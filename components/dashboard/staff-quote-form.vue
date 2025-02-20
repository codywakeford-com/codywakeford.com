<template>
  <div class="quote-form">
    <div class="quote-items">
      <div class="add-item">
        <label for="">Name</label>
        <input type="text" v-model="newQuoteItem.name" />
        <label for="">Quantity</label>
        <input type="text" v-model="newQuoteItem.quantity" />
        <label for="">Unit Price</label>
        <input type="text" v-model="newQuoteItem.unitPrice" />
      </div>
      <button @click="addQuoteItem()">Add item</button>
    </div>

    <div class="item" v-for="(item, index) in quoteItems">
      <div>Item: {{ item.name }}</div>
      <div>Quantity: {{ item.quantity }}</div>
      <div>Unit Price: {{ item.unitPrice }}</div>
      <button @click="removeQuoteItem(index)">Delete</button>
    </div>
  </div>

  <button @click="createQuoteDoc()">make doc</button>

  <embed v-if="quoteUrl" :src="quoteUrl" type="application/pdf" />
</template>

<script setup lang="ts">
import { uuid } from "~/utils/uuid";

const quoteItems = ref<QuoteItem[]>([]);
const quoteUrl = ref<null | string>(null);
const newQuoteItem = ref<QuoteItem>({
  name: "",
  quantity: 0,
  unitPrice: 0,
  paymentType: "single",
  get subtotal() {
    return this.quantity * this.unitPrice;
  },
});

function addQuoteItem() {
  for (let value of Object.values(newQuoteItem.value)) {
    if (!value) return;
  }

  quoteItems.value.push(newQuoteItem.value);

  newQuoteItem.value = {
    name: "",
    quantity: 0,
    unitPrice: 0,
    paymentType: "single",

    get subtotal() {
      return this.quantity * this.unitPrice;
    },
  };
}

interface Props {
  projectId: string;
}

const props = defineProps<Props>();

async function createQuoteDoc() {
  const total = quoteItems.value.reduce((sum: number, item: QuoteItem) => {
    return sum + item.subtotal;
  }, 0);

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
  };

  const url = (await $fetch("/api/pdf/quote", {
    method: "POST",
    body: quote,
  })) as string;

  console.log(url);

  quoteUrl.value = url;
}

function removeQuoteItem(i: number) {
  quoteItems.value.splice(i, 1);
}
</script>

<style lang="scss" scoped></style>
