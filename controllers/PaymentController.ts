import type { PaymentMethod, Stripe, StripeCardElement } from "@stripe/stripe-js"
import PaymentService from "~~/services/PaymentService"

interface PayWithCardElementInput {
    stripe: Stripe
    card: StripeCardElement
    name: string
    amount: number
}
export default class PaymentController {
    static async payWithCardElement({ stripe, card, name, amount }: PayWithCardElementInput) {
        const clientSecret = await PaymentService.getPaymentSecret({
            amount,
            currency: "gbp",
            payment_method_types: ["card"],
        })

        const result = await PaymentService.confirmCardPayment(stripe, clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: name,
                },
            },
        })

        return result
    }

    static async payWithPaymentMethod({ customerId, paymentMethod, amount }: { customerId: Stripe.Customer["id"]; paymentMethod: PaymentMethod; amount: number }) {
        const paymentOptions: Stripe.PaymentIntentCreateParams = {
            currency: "gbp",
            amount,
            customer: customerId,
            receipt_email: paymentMethod.billingAddress.email,
        }

        const clientSecret = await PaymentService.getPaymentSecret(paymentOptions)

        try {
            const { paymentIntent, error } = await PaymentService.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.paymentMethodId,
            })

            if (!paymentIntent) {
                throw createError({ statusCode: 500 })
            }

            await PaymentService.savePaymentRecord(paymentIntent, paymentMethod)

            return { paymentRecord, paymentIntent, error }
        } catch (error) {
            console.error("Error handling payment:", error)
        }
    }

    static async setupPaymentMethod(stripe: StripeClient, cardElement: StripeCardNumberElement | StripeCardElement, billingAddress: StripeBillingAddress, customerId: Stripe.Customer["id"]) {
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

            return paymentMethod
        } catch (error) {
            console.error(error)
        }
    }
}
