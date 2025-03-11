import type {
    PaymentMethod,
    ConfirmCardPaymentData,
    PaymentIntent,
    SetupIntent,
    Stripe,
    StripeCardElement,
    StripeCardNumberElement,
} from "@stripe/stripe-js"
import DbService from "./DbService"
import Billing from "~/pages/dashboard/profile/billing.vue"

export default class PaymentService {
    static async getPaymentSecret(paymentOptions: Stripe.PaymentIntentCreateParams): Promise<string> {
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

    static generatePaymentRecord(
        paymentIntent: PaymentIntent,
        billing: PaymentRecord["billing"],
        projectId: string,
        userId: string,
    ) {
        const paymentRecord: PaymentRecord = {
            paymentIntent,
            billing,
            timestamp: Date.now(),
            projectId,
            userId: userId,
        }

        return paymentRecord
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

    static async confirmCardPayment(stripe: Stripe, clientSecret: string, options: ConfirmCardPaymentData) {
        return await stripe.confirmCardPayment(clientSecret, options)
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

    static async savePaymentMethod(input: PaymentService_SavePaymentMethod) {
        const { setupIntent, billingAddress, userId } = input

        const { last4, brand, expiry } = (await PaymentService.getCardMetadata(
            String(setupIntent.payment_method),
        )) as PaymentMethodMetadata

        const paymentMethod: UserPaymentMethod = {
            paymentMethodId: setupIntent.payment_method,
            billing: billingAddress,
            timestamp: Date.now(),
            last4: last4,
            brand: brand,
            expiry: expiry,
            nameOnCard: billingAddress.name,
        }

        await DbService.createObject(`/users/${userId}/payment-methods`, paymentMethod)
    }

    static async setupPaymentMethod(params: PaymentService_SetupPaymentMethod) {
        const { stripe, cardElement, billing, customerId } = params

        const { clientSecret } = await PaymentService.getSetupIntentSecret(customerId)

        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: billing.name,
                    email: billing.email,
                },
            },
        })

        return { setupIntent, error }
    }

    static async createStripeCustomer(email: string) {
        const customer = await $fetch<Stripe.Customer>("/api/stripe/create-customer", {
            method: "POST",
            body: { email },
        })

        if (!customer) throw new Error("Customer failed to create")

        const stripePaymentProfile: User["stripePaymentProfile"] = {
            customerId: customer.id,
            paymentMethods: [],
        }

        return stripePaymentProfile
    }
}
