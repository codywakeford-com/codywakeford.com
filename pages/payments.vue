<template>
    <div class="pattern-background"></div>
    <main>
        <section>
            <header>
                <h1>Make a payment</h1>
            </header>

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
                        <input :class="{ error: errors.country }" class="input-element" type="text"
                            v-model="address.country" />
                        <div :class="{ active: errors.country }" class="error-message">{{ errors.country }}</div>
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
import { Icon } from "@iconify/vue"
import type { StripeCardCvcElement, StripeCardExpiryElement, StripeAddressElement, StripeCardNumberElement } from "@stripe/stripe-js"
import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"

const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const stripe = ref<Stripe | null>(null)

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

    for (let v of Object.values(errors.value)) {
        if (v) {
            return false
        }
    }

    return true
}

async function pay() {
    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) return
    if (!validate()) return

    loading.value = true

    try {
        const clientSecret = await getPaymentSecret({
            amount: 100,
            currency: "gbp",
            payment_method_types: ["card"],
        })

        const result = await stripe.value.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumber.value,
                billing_details: {
                    name: address.value.fullName,
                },
            },
        })

        if (result.error) {
            state.value.errorMessage = "An error has occured"
        } else if (result.paymentIntent.status === "succeeded") {
            state.value.successMessage === "sucess"
        }
    } catch (e) {
        console.log(e)
        state.value.errorMessage = "An error has occured"
    } finally {
        loading.value = false
    }
}

const loading = ref(false)
onMounted(async () => {
    const config = useRuntimeConfig()
    stripe.value = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)

    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
        throw new Error("Stripe not init")
    }

    const elements = stripe.value.elements()
    const cardNumberElement = elements.create("cardNumber")
    const cardExpiryElement = elements.create("cardExpiry")
    const cardCvcElement = elements.create("cardCvc")

    cardNumberElement.mount("#card-number-element")
    cardExpiryElement.mount("#card-expiry-element")
    cardCvcElement.mount("#card-cvc-element")

    // card.value = cardNumberElement
})
</script>

<style lang="scss" scoped>
main {
    min-height: calc(100vh - 110px);
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
    padding: 25px;
    gap: 20px;
    border-radius: 15px;
    border: 1px solid $text-light1;
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

    .submit-button {
        padding: 10px 20px;
        border-radius: 10px;
        margin-inline: auto;
        margin-top: 35px;
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
