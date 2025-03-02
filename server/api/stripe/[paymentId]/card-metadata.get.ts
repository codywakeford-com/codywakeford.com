import Stripe from "stripe"
const config = useRuntimeConfig()

const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY as string
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
})

export default eventHandler(async (event) => {
    const db = event.context.db
    const { paymentId } = event.context.params || {}

    if (!paymentId) {
        throw createError({ statusCode: 400, statusMessage: "Server expects `paymentId`" })
    }

    try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentId)

        if (!paymentMethod || !paymentMethod.card) {
            throw createError({ statusCode: 500, statusMessage: "Payment method is not a card" })
        }

        const last4 = paymentMethod.card.last4
        const brand = paymentMethod.card.brand
        const expiry = `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`
        if (!last4 || !brand || !expiry) {
            throw createError({ statusCode: 500, statusMessage: "Card last4 digits not found" })
        }

        return { last4, brand, expiry }
    } catch (error) {
        console.error("Error retrieving payment method:", error)
        throw createError({ statusCode: 500 })
    }
})
