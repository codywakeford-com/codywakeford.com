import Stripe from "stripe"

const config = useRuntimeConfig()

const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY as string
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
})

export default eventHandler(async (event) => {
    const { email } = await readBody(event)

    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `email` in request body.",
        })
    }

    try {
        const customer = await stripe.customers.create({
            email,
        })

        return customer
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
