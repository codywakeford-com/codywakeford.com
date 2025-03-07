<template>
    <div class="pattern-background"></div>
    <main>
        <section>
            <header>
                <h1>Make a payment</h1>

                <div class="amount">
                    <h2 v-if="amount">£{{ (amount / 100).toFixed(2) }}</h2>
                    <input type="text" v-else />
                </div>
            </header>

            <form>
                <div class="left">
                    <div class="form-item">
                        <label for="cardNumber">Card Number</label>
                        <div class="input-element" id="card-number-element1" ref="cardNumber" />
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
                        <input class="input-element" type="email" placeholder="email" v-model="address.email.input" />
                        <div :class="{ active: address.email.error }" class="error-message">
                            {{ address.email.error }}
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="form-item">
                        <label for="">Full Name</label>
                        <input class="input-element" type="text" v-model="address.fullName.input" />
                        <div :class="{ active: address.fullName.error }" class="error-message">
                            {{ address.fullName.error }}
                        </div>
                    </div>

                    <div class="form-item">
                        <label for="">City</label>
                        <input class="input-element" type="text" v-model="address.city.input" />
                        <div :class="{ active: address.city.error }" class="error-message">
                            {{ address.city.error }}
                        </div>
                    </div>

                    <div class="form-item">
                        <label for="">Postcode</label>
                        <input class="input-element" type="text" v-model="address.postcode.input" />
                        <div :class="{ active: address.postcode.error }" class="error-message">
                            {{ address.postcode.error }}
                        </div>
                    </div>

                    <div class="form-item">
                        <label for="">Country</label>
                        <input :class="{ error: address.country.error }" class="input-element" type="text" v-model="address.country.input" />
                        <div :class="{ active: address.country.error }" class="error-message">
                            {{ address.country.error }}
                        </div>
                    </div>
                </div>
            </form>

            <div class="button-box">
                <btn class="loading-button" @click="pay()" :disabled="loading" :loading="loading">Make Payment</btn>
                <div class="error-message">{{ state.errorMessage }}</div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
const route = useRoute()
const amount = ref<number>()
const userInputAmount = ref<number>(0)

import type { StripeCardCvcElement, StripeCardExpiryElement, StripeAddressElement, StripeCardNumberElement } from "@stripe/stripe-js"
import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"
import PaymentController from "~~/controllers/PaymentController"
import { InputValidationService, required } from "~~/services/InputValidationService"

const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const stripe = ref<Stripe | null>(null)
const card = ref()

const { onLoaded } = useScriptStripe()
onMounted(() => {
    onLoaded(({ Stripe }) => {
        amount.value = route.query.amount || 1000
        stripe.value = Stripe(useRuntimeConfig().public.STRIPE_PUBLISHABLE_KEY)

        if (!stripe.value) return

        const elements = stripe.value.elements()
        cardNumber.value = elements.create("cardNumber")
        cardExpiry.value = elements.create("cardExpiry")
        cardCvc.value = elements.create("cardCvc")

        card.value = cardNumber.value // data sent in payment request

        cardNumber.value.mount("#card-number-element1")
        cardExpiry.value.mount("#card-expiry-element")
        cardCvc.value.mount("#card-cvc-element")
    })
})

const address = ref<FormInput>({
    fullName: {
        input: "",
        error: [],
        validators: [required, isValidEmail],
    },
    email: {
        input: "",
        error: [],
        validators: [required],
    },

    country: {
        input: "",
        error: [],
        validators: [required],
    },
    street: {
        input: "",
        error: [],
        validators: [required],
    },
    city: {
        input: "",
        error: [],
        validators: [required],
    },
    postcode: {
        input: "",
        error: [],
        validators: [required],
    },
})

const errors = ref({
    fullName: "",
    email: "",
    country: "",
    city: "",
    postcode: "",
    amount: "",
})

const state = ref({
    successMessage: "",
    errorMessage: "",
    loading: false,
})

function validate() {
    const { fullName, email, country, city, postcode } = address.value

    if (!fullName) {
        errors.value.fullName = "Name field is required"
    }

    if (!email) {
        errors.value.email = "Email field is required"
    }

    if (!country) {
        errors.value.country = "Country field is required"
    }

    if (!city) {
        errors.value.city = "City field is required"
    }

    if (!postcode) {
        errors.value.postcode = "Postcode field is required"
    }

    if (!email) {
        errors.value.email = "Email field is required"
    }

    if (!amount.value && !userInputAmount.value) {
        errors.value.amount = "Please specify an amount."
    }

    for (let v of Object.values(errors.value)) {
        if (v) {
            return false
        }
    }

    return true
}

async function pay() {
    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
        throw new Error("Stripe or stripe elements not initialized properly.")
    }

    if (!InputValidationService.validate(address)) return

    loading.value = true

    try {
        const amountToPay = amount.value ? amount.value : userInputAmount.value

        const result = await PaymentController.payWithCardElement({
            stripe: stripe.value,
            card: card.value,
            name: address.value.fullName,
            amount: amountToPay,
        })
    } catch (e) {
        console.log(e)
        state.value.errorMessage = "An error has occured"
    } finally {
        loading.value = false
    }
}

const loading = ref(false)
</script>

<style lang="scss" scoped>
main {
    min-height: calc(100vh - 75px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

section {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    background: white;
    padding-block: 35px 25px;
    padding-inline: 25px;
    gap: 20px;
    border-radius: 5px;
    border: 1px solid $text-light2;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h1 {
        font-size: 1.25rem;
        margin-bottom: 15px;
    }
}

form {
    display: flex;
    gap: 25px;

    label {
        font-weight: 300;
        font-size: 0.9rem;
    }

    .left,
    .right {
        display: flex;
        flex-direction: column;
        gap: 15px;
        min-width: 300px;
        text-align: start;
    }

    .form-item {
        display: flex;
        flex-direction: column;
        gap: 3px;
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
</style>
