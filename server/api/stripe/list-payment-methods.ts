import Stripe from "stripe"

const config = useRuntimeConfig()

const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY as string
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
})

export default eventHandler(async (event) => {
    const { customerId } = await readBody(event)

    if (!customerId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `customerId` in request body.",
        })
    }

    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    })

    return paymentMethods
})
