<template>
  <main v-if="receipt">
    <header>
      <div style="background-color: #081c44" class="blue-logo-box">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/cw-logo.webp?alt=media&token=8572be88-d5f1-4c58-9c0e-2ef76b5a185a"
          alt=""
        />
      </div>
      <div>
        <h1>Payment Receipt</h1>
        <h2>codywakeford.com</h2>
      </div>
    </header>

    <article>
      <h2 class="thank-you">
        Thank you {{ receipt.billingAddress.name.split(" ")[0] }}, your payment
        has been received.
      </h2>

      <section>
        <h3>Payment Details</h3>

        <table>
          <tbody>
            <tr>
              <td>Reference:</td>
              <td>{{ receipt.projectId }}</td>
            </tr>

            <tr>
              <td>Date:</td>
              <td>{{ receipt.timestamp }}</td>
            </tr>

            <tr>
              <td>Payment Method:</td>
              <td>Card</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>Overview</h3>

        <table>
          <tbody>
            <tr>
              <td>Taxes VAT:</td>
              <td>{{ receipt.taxRate }}%</td>
            </tr>

            <tr>
              <td>Currency:</td>
              <td class="currency">{{ receipt.currency }}</td>
            </tr>

            <tr>
              <td>Total Paid:</td>
              <td>£{{ (receipt.totalPaid / 100).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>Billing Address</h3>

        <div class="billing-address">
          <span>{{ receipt.billingAddress.name }}</span>
          <span>{{ receipt.billingAddress.email }}</span>
          <span>{{ receipt.billingAddress.line1 }}</span>
          <span>{{ receipt.billingAddress.city }}</span>
          <span>{{ receipt.billingAddress.country }}</span>
          <span>{{ receipt.billingAddress.postal_code }}</span>
        </div>
      </section>

      <section>
        <h3>Thank you for your business!</h3>
        <p>
          If you have any questions about this invoice, feel free to contact me
          at my contact details listed at the bottom of the page.
        </p>
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
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "empty",
});

const route = useRoute();
const receipt = ref<PaymentRecord | null>(null);

if (route.query.receipt) {
  try {
    receipt.value = JSON.parse(route.query.receipt as string);
  } catch (e) {
    console.error("Invalid JSON in query parameter:", e);
    receipt.value = null;
  }
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;

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

    td {
      &:first-child {
        font-weight: 600;
      }
    }
  }
  th,
  td {
    padding: 10px 50px 10px 20px;
    text-align: left;
    vertical-align: center;
    height: 20px;
  }
}

.currency {
  text-transform: uppercase;
}
p {
  margin: 0;
  padding-bottom: 10px;
  font-size: 0.9rem;
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
.thank-you {
  margin-top: 50px;
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
.billing-address {
  display: flex;
  flex-direction: column;
  gap: 5px;
  span {
    font-size: 0.8rem;
  }
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
