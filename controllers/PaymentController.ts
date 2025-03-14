import type { PaymentMethod, PaymentMethodCreateParams, Stripe, StripeCardElement } from "@stripe/stripe-js"
import DbService from "~~/services/DbService"
import PaymentService from "~~/services/PaymentService"
import ActionController from "./ActionsController"
import ProjectController from "./ProjectsController"
import ProjectPhaseService from "~~/services/ProjectPhaseService"

interface PayWithCardElementInput {
    projectId: string
    stripe: Stripe
    card: StripeCardElement
    billing: PaymentRecord["billing"]
    amount: number
    userId: string
}

export default class PaymentController {
    static async payWithCardElement({ projectId, stripe, card, billing, amount, userId }: PayWithCardElementInput) {
        const $Projects = useProjectStore()
        try {
            const clientSecret = await PaymentService.getPaymentSecret({
                amount,
                currency: "gbp",
                payment_method_types: ["card"],
            })

            const { paymentIntent } = await PaymentService.confirmCardPayment(stripe, clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: billing.name,
                    },
                },
            })

            if (!paymentIntent) throw new Error("An error occured getting the payment intent.")

            // TODO create and send email reciept

            const paymentRecord = PaymentService.generatePaymentRecord(paymentIntent, billing, projectId, userId)

            await $fetch(`/api/projects/update-amount-paid`, {
                method: "PUT",
                body: { id: projectId, amountPaid: paymentIntent.amount },
            })

            await DbService.createObject<PaymentRecord>(`/projects/${projectId}/payment-records`, paymentRecord)
            await DbService.createObject<PaymentRecord>(`/users/${userId}/payment-records`, paymentRecord)
            await ActionController.onPayment(projectId)
            await ProjectPhaseService.incrementPhase($Projects.getByProjectId(projectId))

            return { error: null }
        } catch (e) {
            return { error: "An unknown error has occured, please try again later." }
        }
    }

    static async payWithPaymentMethod({
        customerId,
        paymentMethod,
        amount,
    }: {
        customerId: Stripe.Customer["id"]
        paymentMethod: PaymentMethod
        amount: number
    }) {
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

    static async setupPaymentMethod({ stripe, cardElement, billing }: PaymentController_SetupPaymentMethod) {
        const $User = useUserStore()

        try {
            let customerId: string | undefined = $User.getStripeCustomerId

            if (!customerId) {
                customerId = (await PaymentService.createStripeCustomer($User.state.user.email)).customerId
            }

            const { setupIntent, error } = await PaymentService.setupPaymentMethod({
                customerId: customerId || "",
                stripe,
                cardElement,
                billing,
            })

            await PaymentService.savePaymentMethod({
                userId: $User.state.user.id,
                setupIntent,
                billingAddress: billing,
            })

            return { error: null }
        } catch (error) {
            console.error(error)
            return { error: "An unknown error has occured, please try again later" }
        }
    }
}
