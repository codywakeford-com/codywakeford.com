<script setup lang="ts">
import { Icon } from "@iconify/vue"
import type {
    StripeCardCvcElement,
    StripeCardExpiryElement,
    StripeAddressElement,
    StripeCardNumberElement,
} from "@stripe/stripe-js"

import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"

const selectedCardIndex = ref<number>(0)
const card = ref<StripeCardNumberElement | null>(null)
const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const addressElement = ref<StripeAddressElement | null>(null)
// const card = ref<StripeCardElement | null>(null)
const stripe = ref<Stripe | null>(null)
const projectId = ref("")
const billingAddress = ref<StripeBillingAddress>({
    name: "",
    line1: "",
    line2: "",
    email: "codypwakeford@gmail.com",
    country: "",
    city: "",
    state: "",
    postal_code: "",
})

const newCard = ref(false)

const paymentProfiles = computed(() => {
    return $User.stripePaymentProfile?.paymentMethods || []
})

const state = ref({
    successMessage: "",
    errorMessage: "",
    loading: false,
})

const paymentMultiplyer = ref(0.333)
const amount = computed(() => {
    const project = $Projects.getProjectById(projectId.value)
    const total = Number(project?.quote?.totalAmount)

    return total * paymentMultiplyer.value
})
const total = computed((): number => {
    const project = $Projects.getProjectById(projectId.value)
    const quote = project?.quote

    if (!quote) return 0

    return quote?.totalAmount
})

interface Props {}

const props = defineProps<Props>()
const loading = ref(false)
onMounted(async () => {
    projectId.value = $Projects.selectedProjectId

    const config = useRuntimeConfig()
    stripe.value = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)

    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
        throw new Error("Stripe not init")
    }

    const elements = stripe.value.elements()
    const cardNumberElement = elements.create("cardNumber")
    const cardExpiryElement = elements.create("cardExpiry")
    const cardCvcElement = elements.create("cardCvc")
    const addressElementInstance = elements.create("address", {
        mode: "billing",
    })

    cardNumberElement.mount("#card-number-element")
    cardExpiryElement.mount("#card-expiry-element")
    cardCvcElement.mount("#card-cvc-element")
    addressElementInstance.mount("#address-element")

    addressElementInstance.on("change", (event) => {
        billingAddress.value.name = event.value.name
        billingAddress.value.city = event.value.address.city
        billingAddress.value.line1 = event.value.address.line1
        billingAddress.value.line2 = event.value.address.line2
        billingAddress.value.country = event.value.address.country
        billingAddress.value.postal_code = event.value.address.postal_code
        billingAddress.value.state = event.value.address.state
    })

    card.value = cardNumberElement
})

async function pay() {
    if (!stripe.value || !cardNumber.value || !card.value) {
        throw new Error("Stripe not initialized or card element not created!")
    }

    loading.value = true

    try {
        const selectedPaymentProfile = paymentProfiles.value[selectedCardIndex.value]

        if (!$User.stripePaymentProfile.customerId) throw new Error("No customer id")

        const paymentRecord = await $Stripe.payWithPaymentProfile(
            stripe.value,
            $User.stripePaymentProfile.customerId,
            selectedPaymentProfile,
            amount.value
        )

        const projectId = $Projects.selectedProjectId

        if (!paymentRecord) throw new Error("No payment record")
        if (!projectId) throw new Error("No projectId")

        await $User.addPaymentRecord(projectId, paymentRecord)
        await $ActivityLogs.addMessageActivityItem(projectId, "has made a payment", $User.email)
        await $Projects.changePhaseOnPayment(projectId)

        loading.value = false
    } catch (error) {
        console.error(error)

        loading.value = false
    }
}
</script>
<template>
    <modal id="paymentModal">
        <section class="modal-body">
            <header>
                <h1>Make a payment</h1>
            </header>

            <div class="balance">
                <div class="total">£{{ (total / 100).toFixed(2) }}</div>
                <div class="amount">£{{ (amount / 100).toFixed(2) }}</div>
            </div>

            <div class="controls">
                <button @click="paymentMultiplyer = 0.333">Pay 33%</button>
                <button @click="paymentMultiplyer = 1">Pay All</button>
            </div>

            <form @submit.prevent="pay" class="payment-form">
                <div class="saved-cards">
                    <stripe-payment-method-sm
                        v-for="(card, index) of paymentProfiles"
                        @click="selectedCardIndex = index"
                        :key="index"
                        :card="card"
                        :selected="selectedCardIndex === index"
                    />
                </div>
                <btn class="loading-button" :disabled="loading" :loading="loading">Make Payment</btn>
            </form>

            <!-- TODOOOOo -->
            <div v-show="selectedCardIndex === 99">
                <form>
                    <div class="left">
                        <div class="form-item">
                            <label for="cardNumber">Card Number</label>
                            <div class="input-element" id="card-number-element" ref="cardNumber" />
                        </div>

                        <div class="form-item">
                            <label for="cardExpiry">Expiration Date</label>
                            <div class="input-element" id="card-expiry-element" ref="cardExpiry" />
                        </div>

                        <div class="form-item">
                            <label for="cardCvc">CVC</label>
                            <div class="input-element" id="card-cvc-element" ref="cardCvc" />
                        </div>

                        <div class="form-item">
                            <label for="email">Reciept Email:</label>
                            <input
                                class="input-element"
                                type="email"
                                placeholder="email"
                                v-model="billingAddress.email"
                            />
                        </div>
                    </div>

                    <div class="right">
                        <!-- <h2>Billing Address</h2> -->
                        <div id="address-element" ref="addressElement"></div>
                    </div>
                </form>
                <div class="button-box">
                    <button-primary-m class="submit-button" @click="pay">Save Card</button-primary-m>
                </div>
            </div>
        </section>
    </modal>
</template>

<style lang="scss" scoped>
.modal-body {
    display: flex;
    flex-direction: column;
    gap: 10px;

    background: white;
    padding: 25px;
    border-radius: $border-radius;
}
h2 {
    font-size: 1.25rem;
    margin-bottom: 35px;
}
form {
    display: flex;
    gap: 25px;

    label {
        font-weight: 300;
        font-size: 0.9rem;
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 15px;
        min-width: 300px;

        .form-item {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        gap: 5px;

        h3 {
            font-weight: 500;
            margin-bottom: 10px;
        }
    }
}
.loading-button {
    height: 30px;
    color: white;
    border: 0;
    margin: 0;
    margin-inline: auto;
    width: 100%;
    background: $primary;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $border-radius;
}

.input-element {
    background: none;
    padding: 10px 10px;
    border: 1px solid lightgrey;
    border-radius: 5px;

    &:focus-within {
        border: 1px solid $primary;
        outline: none;
    }
}

.StripeElement--focus {
    border: 1px solid $primary;
}

.button-box {
    width: 100%;
    display: flex;
    justify-content: center;

    .submit-button {
        padding: 10px 20px;
        border-radius: 10px;
        margin-inline: auto;
        margin-top: 35px;
    }
}

.add-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 15px;
    cursor: pointer;

    outline: 1px solid $text-light3;
    border-radius: $border-radius;
    transition: none;

    span {
        font-size: 0.8rem;
        font-weight: 600;
    }

    &.selected {
        outline: 2px solid $primary;
    }
}

.saved-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}
</style>
