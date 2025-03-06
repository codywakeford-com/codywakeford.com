import type { PaymentMethod, ConfirmCardPaymentData, PaymentIntent, SetupIntent, Stripe } from "@stripe/stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import DbService from "./DbService"

export default class PaymentService {
    static async getPaymentSecret(paymentOptions: Stripe.PaymentIntentCreateParams): Promise<string> {
        console.log(paymentOptions)
        const { clientSecret } = await $fetch<{ clientSecret: string }>("/api/stripe/create-payment-intent", {
            method: "POST",
            body: paymentOptions,
        })

        if (!clientSecret) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch client secret.",
            })
        }

        return clientSecret
    }

    static async getSetupIntentSecret(customerId: Stripe.Customer["id"]) {
        const { clientSecret } = await $fetch<{ clientSecret: string }>("/api/stripe/create-setup-intent", {
            method: "POST",
            body: { customerId },
        })

        if (!clientSecret) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch setup intent secret.",
            })
        }

        return { clientSecret, customerId }
    }

    static async createCustomer(email: string) {
        try {
            const customer = await $fetch<Stripe.Customer>("/api/stripe/create-customer", {
                method: "POST",
                body: { email },
            })

            return { customer: customer }
        } catch (error) {
            console.error(error)
        }
    }

    static async confirmCardPayment(stripe: Stripe, clientSecret: string, options: ConfirmCardPaymentData) {
        const result = await stripe.confirmCardPayment(clientSecret, options)

        return result
    }

    static async getCardMetadata(paymentMethodId: string) {
        try {
            const response = await $fetch(`/api/stripe/${paymentMethodId}/card-metadata`)

            return response
        } catch (error) {
            console.error(error)
        }
    }

    static async listPaymentMethod(customerId: Stripe.Customer["id"]) {
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

    static async savePaymentMethod(customerId: Stripe.Customer["id"], setupIntent: SetupIntent, billingAddress: StripeBillingAddress) {
        const { last4, brand, expiry } = (await this.getCardMetadata(String(setupIntent.payment_method))) as PaymentMethodMetadata

        const paymentMethod: PaymentMethod = {
            paymentMethodId: String(setupIntent.payment_method),
            billingAddress: billingAddress,
            timestamp: Date.now(),
            last4: last4,
            brand: brand,
            expiry: expiry,
            nameOnCard: billingAddress.name,
        }
    }

    static async savePaymentRecord(paymentIntent: PaymentIntent, paymentMethod: PaymentMethod) {
        const paymentRecord: PaymentRecord = {
            totalPaid: paymentIntent.amount,
            transactionId: paymentIntent.id,
            billingAddress: paymentMethod.billingAddress,
            timestamp: String(Date.now()),
            currency: "gbp",
            taxRate: 0,
            description: "",
        }

        DbService.createObject(`/`)
    }

    static async setupPaymentMethod() {
        const stripe = await loadStripe(useRuntimeConfig().public.STRIPE_PUBLISHABLE_KEY)

        if (!stripe) throw new Error("stripe failed to initialize")
    }
}
