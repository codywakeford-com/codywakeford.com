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
            statusMessage: "Server expects `customerId` in request body.",
        })
    }

    try {
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return { clientSecret: setupIntent.client_secret }
    } catch (error) {
        console.error(error)

        throw createError({ statusCode: 500 })
    }
})
