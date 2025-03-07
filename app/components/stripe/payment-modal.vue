<template>
    <dialog ref="modal" @click="modal?.close()" id="payment-modal">
        <section class="modal-body" @click.stop.prevent>
            <header>
                <h1 v-if="$BillingModal.type === 'save-card'">Add a card</h1>
                <h1 v-else>Make a payment</h1>

                <div class="amount">
                    <h2 v-if="amount">£{{ (amount / 100).toFixed(2) }}</h2>
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
                        <div class="input-element" id="card-number-element2" ref="cardNumber" />
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
                        <input class="input-element" type="email" placeholder="email" v-model="address.email" />
                        <div :class="{ active: errors.email }" class="error-message">{{ errors.email }}</div>
                    </div>
                </div>

                <div class="right">
                    <div class="form-item">
                        <label for="">Full Name</label>
                        <input class="input-element" type="text" v-model="address.fullName" />
                        <div :class="{ active: errors.fullName }" class="error-message">{{ errors.fullName }}</div>
                    </div>

                    <div class="form-item">
                        <label for="">Street</label>
                        <input class="input-element" type="text" v-model="address.street" />
                        <div :class="{ active: errors.street }" class="error-message">{{ errors.street }}</div>
                    </div>

                    <div class="form-item">
                        <label for="">City</label>
                        <input class="input-element" type="text" v-model="address.city" />
                        <div :class="{ active: errors.city }" class="error-message">{{ errors.city }}</div>
                    </div>

                    <div class="form-item">
                        <label for="">Postcode</label>
                        <input class="input-element" type="text" v-model="address.postcode" />
                        <div :class="{ active: errors.postcode }" class="error-message">{{ errors.postcode }}</div>
                    </div>

                    <div class="form-item">
                        <label for="">Country</label>
                        <input :class="{ error: errors.country }" class="input-element" type="text" v-model="address.country" />
                        <div :class="{ active: errors.country }" class="error-message">{{ errors.country }}</div>
                    </div>

                    <div v-if="$BillingModal.type !== 'save-card'" class="form-item">
                        <label for="save-card">Save my card for future payments</label>
                        <input type="checkbox" name="save-card" />
                    </div>

                    <button v-if="$BillingModal.type !== 'save-card'" @click="useNewCard = false">Use saved card</button>
                </div>
            </form>

            <div class="button-box">
                <btn class="loading-button" @click="addCard()" v-if="$BillingModal.type === 'save-card'" :disabled="loading" :loading="loading">Save Card</btn>
                <btn class="loading-button" @click="pay()" v-else :disabled="loading" :loading="loading">Make Payment </btn>
                <div class="error-message">{{ state.errorMessage }}</div>
            </div>
        </section>
    </dialog>
</template>

<script setup lang="ts">
const route = useRoute()
const amount = ref<number>()
const userInputAmount = ref<number>(0)
const $BillingModal = useBillingModalStore()

const useNewCard = ref(false) // keeps track if the user wants to use a saved card or not

const modal = ref<HTMLDialogElement | null>(null)
import type { StripeCardCvcElement, StripeCardExpiryElement, StripeAddressElement, StripeCardNumberElement } from "@stripe/stripe-js"
import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"
import PaymentController from "~~/controllers/PaymentController"

const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const stripe = ref<Stripe | null>(null)
const card = ref()

const paymentProfiles = computed(() => {
    return $User.stripePaymentProfile?.paymentMethods || []
})

const selectedCardIndex = ref<number>(0)

interface Props {
    onComplete?: (setupRecord: PaymentMethod) => void
    onFailure?: () => void
}

const props = defineProps<Props>()

const { onLoaded } = useScriptStripe()
onMounted(() => {
    onLoaded(({ Stripe }) => {
        amount.value = Number(route.query.amount) || 10000
        stripe.value = Stripe(useRuntimeConfig().public.STRIPE_PUBLISHABLE_KEY)

        if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
            throw new Error("Stripe or stripe elements not initialized properly.")
        }

        const elements = stripe.value.elements()
        cardNumber.value = elements.create("cardNumber")
        cardExpiry.value = elements.create("cardExpiry")
        cardCvc.value = elements.create("cardCvc")

        card.value = cardNumber.value // data sent in payment request

        cardNumber.value.mount("#card-number-element2")
        cardExpiry.value.mount("#card-expiry-element")
        cardCvc.value.mount("#card-cvc-element")
    })
})

const address = ref({
    fullName: "Cody Wakeford",
    email: "codypwakeford@gmail.com",
    country: "England",
    street: "10 East vale drive",
    city: "Rotherham",
    postcode: "S654HS",
})

const errors = ref({
    fullName: "",
    email: "",
    country: "",
    city: "",
    postcode: "",
    amount: "",
    street: "",
})

const state = ref({
    successMessage: "",
    errorMessage: "",
    loading: false,
})

function validate() {
    const { fullName, email, street, country, city, postcode } = address.value

    if (!fullName) {
        errors.value.fullName = "Name field is required"
    }

    if (!email) {
        errors.value.email = "Email field is required"
    }

    if (!street) {
        errors.value.street = "Email field is required"
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

    if (!validate()) return

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

<style lang="scss" scoped>
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
