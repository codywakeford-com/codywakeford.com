<template>
    <section class="modal-body" @click.stop.prevent>
        <header>
            <h1 v-if="$BillingModal.type === 'save-card'">Add a card</h1>
            <h1 v-else>Make a payment</h1>

            {{ $BillingModal.state.paymentAmount }}

            <div class="amount">
                <h2 v-if="$BillingModal.state.paymentAmount">£{{ $BillingModal.state.paymentAmount.toFixed(2) }}</h2>
                <input type="text" v-else />
            </div>
        </header>

        <form v-if="$BillingModal.type === 'payment' && !useNewCard" @submit.prevent="pay" class="payment-form">
            <div class="saved-cards">
                <stripe-payment-method-sm
                    v-for="(card, index) of $User.stripePaymentProfile?.paymentMethods"
                    @click="selectedCardIndex = index"
                    :key="index"
                    :card="card"
                    :selected="selectedCardIndex === index"
                />
                <button @click="useNewCard = true" class="new-card">Use a new card</button>
            </div>
        </form>
        <form v-show="$BillingModal.type === 'payment' && useNewCard">
            <div class="left">
                <div class="form-item">
                    <label for="cardNumber">Card Number</label>
                    <div class="input-element" :id="`card-number-element${elId}`" ref="cardNumber" />
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
                    <div :class="{ active: address.email.error }" v-for="e of address.email.error" class="error-message">
                        {{ e }}
                    </div>
                </div>
            </div>

            <div class="right">
                <div class="form-item">
                    <label for="">Full Name</label>
                    <input class="input-element" type="text" v-model="address.fullName.input" />
                    <div :class="{ active: address.fullName.error }" v-for="e of address.fullName.error" class="error-message">
                        {{ e }}
                    </div>
                </div>

                <div class="form-item">
                    <label for="">City</label>
                    <input class="input-element" type="text" v-model="address.city.input" />
                    <div :class="{ active: address.city.error }" v-for="e of address.city.error" class="error-message">
                        {{ e }}
                    </div>
                </div>

                <div class="form-item">
                    <label for="">Postcode</label>
                    <input class="input-element" type="text" v-model="address.postcode.input" />
                    <div :class="{ active: address.postcode.error }" v-for="e of address.postcode.error" class="error-message">
                        {{ e }}
                    </div>
                </div>

                <div class="form-item">
                    <label for="">Country</label>
                    <input :class="{ error: address.country.error }" class="input-element" type="text" v-model="address.country.input" />
                    <div :class="{ active: address.country.error }" v-for="e of address.country.error" class="error-message">
                        {{ e }}
                    </div>
                </div>
            </div>

            <button v-if="$BillingModal.type !== 'save-card'" @click="useNewCard = false">Use saved card</button>
        </form>

        <div class="button-box">
            <btn class="loading-button" @click="addCard()" v-if="$BillingModal.type === 'save-card'" :disabled="loading" :loading="loading">Save Card</btn>
            <btn class="loading-button" @click="pay()" v-else :disabled="loading" :loading="loading">Make Payment </btn>
            <div class="error-message">{{ state.errorMessage }}</div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { isValidEmail } from "~~/services/InputValidationService"
import type { StripeCardCvcElement, StripeCardExpiryElement, StripeAddressElement, StripeCardNumberElement } from "@stripe/stripe-js"
import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"
import PaymentController from "~~/controllers/PaymentController"
import { InputValidationService, required } from "~~/services/InputValidationService"

const route = useRoute()
const amount = ref<number | undefined>(undefined)
const userInputAmount = ref<number>(0)
const $BillingModal = useBillingModalStore()
const useNewCard = ref(false) // keeps track if the user wants to use a saved card or not
const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const stripe = ref<Stripe | null>(null)
const card = ref()
const selectedCardIndex = ref<number>(0)
const elId = uuid() // differentiates instances of this component
const { onLoaded } = useScriptStripe()

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
    })
})

const address = ref<FormInput>({
    fullName: {
        input: "",
        error: [],
        validators: [required],
    },
    email: {
        input: "",
        error: [],
        validators: [required, isValidEmail],
    },

    country: {
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

const state = ref({
    successMessage: "",
    errorMessage: "",
    loading: false,
})

async function pay() {
    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
        throw new Error("Stripe or stripe elements not initialized properly.")
    }

    console.log(InputValidationService.validate(address))
    if (!InputValidationService.validate(address)) return

    loading.value = true

    try {
        const amountToPay = amount.value ? amount.value : userInputAmount.value

        await PaymentController.payWithCardElement({
            projectId: useRoute().params.id as string,
            userId: $User.state.user.id,
            stripe: stripe.value,
            card: card.value,
            amount: amountToPay,
            billing: {
                name: address.value.fullName.input,
                email: $User.state.user.email,
                address: {
                    line1: "Street not provided",
                    line2: null,
                    city: address.value.city.input,
                    state: address.value.city.input,
                    postcode: address.value.postcode.input,
                    country: address.value.country.input,
                },
            },
        })
    } catch (e) {
        console.log(e)
        state.value.errorMessage = "An error has occured"
    } finally {
        loading.value = false
    }
}

async function addCard() {
    if (!stripe.value || !cardNumber.value || !card.value) {
        throw new Error("Stripe not initialized or card element not created!")
    }

    loading.value = true
    try {
        if (!address.value) {
            throw new Error("No billing address")
        }

        if (!$User.getStripeCustomerId) {
            await $User.createStripeCustomer()
        }

        const customerId = $User.getStripeCustomerId

        if (!customerId) throw new Error("Stripe customer ID not found")

        const stripeAddress: StripeBillingAddress = {
            name: address.value.fullName,
            postal_code: address.value.postcode,
            line1: address.value.street,
            line2: "",
            state: "",
            city: address.value.city,
            email: address.value.email,
            country: address.value.country,
        }

        const paymentMethod = await $Stripe.setupPaymentMethod(stripe.value, card.value, stripeAddress, customerId)

        if (!paymentMethod) throw new Error("Payment method not found")

        if (paymentMethod) {
            await $User.addPaymentMethod(paymentMethod)

            if (props.onComplete) props.onComplete(paymentMethod)
        }
    } catch (error) {
        console.error("Error in addCard:", error)

        if (props.onFailure) {
            props.onFailure()
        }
    } finally {
        loading.value = false
    }
}
const loading = ref(false)
</script>

<style scoped lang="scss">
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
    background: white;
    padding-block: 35px 25px;
    padding-inline: 25px;
    gap: 20px;
    border-radius: 5px;
    border: 1px solid $text-light2;
}

.new-card {
    width: 100%;
    height: 90px;
    margin-top: 15px;
    border-radius: 5px;
    background: white;
    border: 3px solid $text-light1;
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
