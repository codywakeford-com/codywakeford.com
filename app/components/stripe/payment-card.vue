<template>
    <section @click.stop.prevent>
        <header>
            <div>
                <h1 v-if="$BillingModal.type === 'save-card'">Add a card</h1>
                <h1 v-else>Make a payment</h1>
                <p>A reciept email will be sent to you.</p>
            </div>

            <div class="amount" v-if="$BillingModal.state.ui === 'payment'">
                <h2 v-if="$BillingModal.state.paymentAmount">
                    £{{ ($BillingModal.state.paymentAmount / 100).toFixed(2) }}
                </h2>
                <div v-else class="amount-input">
                    <span>£</span>
                    <input type="number" name="amount" />
                </div>
            </div>
        </header>

        <FormKit type="form" :errors="errors.formErrors" novalidate v-show="useNewCard" ref="form" @submit="submit()">
            <div
                class="existing-cards"
                v-if="$User.state.isLoggedIn && useNewCard && $BillingModal.state.ui === 'payment'"
            >
                <stripe-payment-method-sm
                    @click="selectedCardIndex = index"
                    v-for="(card, index) of $User.state.paymentMethods"
                    :card="card"
                    :selected="selectedCardIndex === index"
                />

                <button class="new-card" @click="useNewCard = true">Use existing card</button>
            </div>

            <div class="flex" v-else-show>
                <div class="left">
                    <form-kit
                        type="text"
                        label="Card Number"
                        :errors="errors.cardErrors"
                        :class="{ 'data-invalid': true }"
                    >
                        <template #input>
                            <div
                                class="formkit-input"
                                :id="`card-number-element${elId}`"
                                ref="cardNumber"
                                validation="required"
                            />
                        </template>
                    </form-kit>

                    <form-kit
                        type="text"
                        label="Card Expiry"
                        :errors="errors.expiryErrors"
                        :class="{ 'data-invalid': errors.expiryErrors?.length }"
                    >
                        <template #input>
                            <div class="formkit-input" id="card-expiry-element" ref="cardExpiry" />
                        </template>
                    </form-kit>

                    <form-kit
                        type="text"
                        label="CVC"
                        :errors="errors.cvcErrors"
                        :class="{ 'data-invalid': errors.expiryErrors?.length }"
                    >
                        <template #input>
                            <div class="formkit-input" id="card-cvc-element" ref="cardCvc" validation="required" />
                        </template>
                    </form-kit>

                    <FormKit type="text" label="Email" validation="required|email" />
                </div>

                <div class="right">
                    <FormKit type="text" label="Full Name" validation="required" v-model="input.fullName" />
                    <FormKit type="text" label="City" validation="required" v-model="input.city" />
                    <FormKit type="text" label="Postcode" validation="required" v-model="input.postcode" />
                    <FormKit type="text" label="Country" validation="required" v-model="input.country" />
                </div>
            </div>

            <template #submit>
                <button type="submit" :disabled="loading" @click="(validateStripeInputs(), form?.node.submit())">
                    <loader v-if="loading" color="white" />
                    <span v-else>{{ $BillingModal.state.ui === "payment" ? "Pay" : "Add Card" }}</span>
                </button>
            </template>
        </FormKit>
    </section>
</template>

<script setup lang="ts">
import type {
    StripeCardCvcElement,
    StripeCardExpiryElement,
    StripeAddressElement,
    StripeCardNumberElement,
} from "@stripe/stripe-js"

import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"
import PaymentController from "~~/controllers/PaymentController"
const form = ref<HTMLFormElement | null>()
const route = useRoute()
const amount = ref<number | undefined>(undefined)
const userInputAmount = ref<number>(0)
const $BillingModal = useBillingModalStore()
const $User = useUserStore()
const useNewCard = ref(true) // keeps track if the user wants to use a saved card or not
const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const stripe = ref<Stripe | null>(null)
const card = ref()
const selectedCardIndex = ref<number>(0)
const elId = uuid() // differentiates instances of this component
const { onLoaded } = useScriptStripe()
const loading = ref(false)

const errors = ref<{ [key: string]: string[] }>({
    cardErrors: [],
    cvcErrors: [],
    expiryErrors: [],
    formErrors: [],
})

onMounted(() => {
    onLoaded(({ Stripe }) => {
        amount.value = Number(route.query.amount) || $BillingModal.state.paymentAmount || undefined
        stripe.value = Stripe(useRuntimeConfig().public.STRIPE_PUBLISHABLE_KEY)

        if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
            throw new Error("Stripe or stripe elements not initialized properly.")
        }

        const elements = stripe.value.elements()
        cardNumber.value = elements.create("cardNumber")
        cardExpiry.value = elements.create("cardExpiry")
        cardCvc.value = elements.create("cardCvc")

        card.value = cardNumber.value // data sent in payment request

        cardNumber.value.mount("#card-number-element" + elId)
        cardExpiry.value.mount("#card-expiry-element")
        cardCvc.value.mount("#card-cvc-element")

        cardNumber.value.on("change", (event) => {
            if (event.error) {
                errors.value.cardErrors?.push(event.error.message)
            }
        })

        cardCvc.value.on("change", (event) => {
            if (event.error) {
                errors.value.cvcErrors?.push(event.error.message)
            }
        })

        cardExpiry.value.on("change", (event) => {
            console.log(event)
            if (event.error) {
                errors.value.expiryErrors?.push(event.error.message)
            }
        })

        if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
            throw new Error("Stripe or stripe elements not initialized properly.")
        }
    })
})

function submit() {
    if ($BillingModal.state.ui === "payment") {
        pay()
    } else {
        addCard()
    }
}

function validateStripeInputs() {
    let c1 = document.getElementById(`card-number-element` + elId)
    let c2 = document.getElementById(`card-cvc-element`)
    let c3 = document.getElementById(`card-expiry-element`)

    if (c1?.classList.contains("StripeElement--empty")) {
        errors.value.cardErrors?.push("Card number is required")
    }
    if (c2?.classList.contains("StripeElement--empty")) {
        errors.value.cvcErrors?.push("Card CVC is required")
    }
    if (c3?.classList.contains("StripeElement--empty")) {
        errors.value.expiryErrors?.push("Card Expiry is required")
    }
}

const input = ref({
    fullName: "",
    email: "",
    country: "",
    city: "",
    postcode: "",
})

async function pay() {
    if (!stripe.value) {
        errors.value.formErrors?.push("An unknown error has occured, please try again later.")
        console.error("Stripe not initialized")
        return
    }

    loading.value = true

    const amountToPay = amount.value ? amount.value : userInputAmount.value

    const { error } = await PaymentController.payWithCardElement({
        projectId: useRoute().params.id as string,
        userId: $User.state.user.id,
        stripe: stripe.value,
        card: card.value,
        amount: amountToPay,
        billing: billing.value,
    })

    if (error) {
        errors.value.formErrors?.push(error)
    }

    loading.value = false
}

async function addCard() {
    if (!stripe.value) {
        errors.value.formErrors?.push("An unknown error has occured, please try again later.")
        console.error("Stripe not initialized")
        return
    }

    loading.value = true

    const { error } = await PaymentController.setupPaymentMethod({
        stripe: stripe.value,
        cardElement: card.value,
        billing: billing.value,
    })

    if (error) {
        errors.value.formError?.push(error)
    }

    loading.value = false
}

const billing = computed(() => {
    return {
        name: input.value.fullName,
        email: $User.state.user.email,
        address: {
            line1: "Street not provided",
            line2: null,
            city: input.value.city,
            state: input.value.city,
            postcode: input.value.postcode,
            country: input.value.country,
        },
    }
})
</script>

<style scoped lang="scss">
section {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    background: var(--background);
    padding-block: 25px 25px;
    padding-inline: 25px;
    gap: 20px;
    border-radius: 5px;
    border: 1px solid var(--text2);
}
dialog {
    min-height: calc(100vh - 75px);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: none;
    border: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

dialog[open] {
    display: flex;
}

.modal-body {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    background: var(--background);
    padding-block: 35px 25px;
    padding-inline: 25px;
    gap: 20px;
    border-radius: 5px;
    border: 1px solid var(--text2);
}

.existing-cards {
    padding-block: 25px;

    .new-card {
        width: 100%;
        height: 90px;
        margin-top: 15px;
        color: var(--text6);
        border-radius: 5px;
        background: var(--background);
        border: 1px solid var(--text2);
    }
}

header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h1 {
        font-size: 1.25rem;
    }
    p {
        margin-bottom: 15px;
        font-size: 0.9rem;
        opacity: 0.9;
    }
}

.formkit-form {
    .left,
    .right {
        display: flex;
        flex-direction: column;
        min-width: 300px;
        text-align: start;
    }

    button {
        width: fit-content;
        margin-inline: auto;
        min-width: 150px;
    }
}

.input-element {
    background: none;
    padding: 10px 10px;
    border: 1px solid lightgrey;
    border-radius: 5px;

    &:focus-within {
        border: 1px solid var(--primary);
        outline: none;
    }
}

.StripeElement--focus {
    border: 1px solid var(--primary);
}

.button-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        padding: 10px 20px;
        border-radius: 5px;
        margin-inline: auto;
        margin-top: 35px;
        width: fit-content;
    }

    .error-message {
        margin-inline: auto;
    }
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.error-message {
    margin-inline: 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: $danger1;
}

.amount-input {
    background: rgba(0, 0, 0, 0.1);
    padding: 5px 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 5px;

    input {
        border: none;
        background: none;

        &:focus {
            outline: none;
        }
    }
}
</style>
