import { defineStore } from "pinia"

//inteface State { }

export const useStripeStore = defineStore("stripeStore", () => {
    const state = ref<State>({})

    async function createCustomer(email: string) {
        try {
            const customer = await $fetch<Stripe.Customer>("/api/stripe/create-customer", {
                method: "POST",
                body: { email },
            })

            return customer
        } catch (error) {
            console.error(error)
        }
    }

    async function listPaymentMethod(customerId: Stripe.Customer["id"]) {
        try {
            const paymentMethods = await $fetch("/api/stripe/list-payment-methods", {
                method: "POST",
                body: { customerId },
            })

            return paymentMethods
        } catch (error) {
            console.error(error)
        }
    }

    async function payWithCardElement({ stripe, card, amount, name }: { stripe: StripeClient; card: StripeCardElement; name: string; amount: number }) {
        const clientSecret = await getPaymentSecret({
            amount,
            currency: "gbp",
            payment_method_types: ["card"],
        })

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: name,
                },
            },
        })

        return result
    }

    async function payWithPaymentMethod({
        stripe,
        customerId,
        paymentMethod,
        amount,
    }: {
        stripe: StripeClient
        customerId: Stripe.Customer["id"]
        paymentMethod: PaymentMethod
        amount: number
    }) {
        if (!stripe) {
            throw new Error("Stripe not initialized or card element not created!")
        }

        const paymentOptions: Stripe.PaymentIntentCreateParams = {
            currency: "gbp",
            amount,
            customer: customerId,
            receipt_email: paymentMethod.billingAddress.email,
        }

        const clientSecret = await getPaymentSecret(paymentOptions)

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.paymentMethodId,
            })

            if (!paymentIntent) {
                throw createError({ statusCode: 500 })
            }

            const paymentRecord: PaymentRecord = {
                totalPaid: paymentIntent.amount,
                transactionId: paymentIntent.id,
                billingAddress: paymentMethod.billingAddress,
                timestamp: String(Date.now()),
                currency: "gbp",
                taxRate: 0,
                description: "",
            }

            return { paymentRecord, paymentIntent, error }
        } catch (error) {
            console.error("Error handling payment:", error)
        }
    }

    async function setupPaymentMethod(
        stripe: StripeClient,
        cardElement: StripeCardNumberElement | StripeCardElement,
        billingAddress: StripeBillingAddress,
        customerId: Stripe.Customer["id"]
    ) {
        try {
            const { clientSecret } = await getSetupIntentSecret(customerId)

            const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: billingAddress.name,
                        email: billingAddress.email,
                    },
                },
            })

            if (error) throw new Error(`${error}`)

            if (!setupIntent) {
                throw createError({ statusCode: 500 })
            }

            const { last4, brand, expiry } = (await getCardMetadata(String(setupIntent.payment_method))) as PaymentMethodMetadata

            const paymentMethod: PaymentMethod = {
                paymentMethodId: String(setupIntent.payment_method),
                billingAddress: billingAddress,
                timestamp: Date.now(),
                last4: last4,
                brand: brand,
                expiry: expiry,
                nameOnCard: billingAddress.name,
            }

            return paymentMethod
        } catch (error) {
            console.error(error)
        }
    }

    return {
        payWithCardElement,
        payWithPaymentMethod,
        createCustomer,
        getPaymentSecret,
        setupPaymentMethod,
        listPaymentMethod,
        state,
    }
})
