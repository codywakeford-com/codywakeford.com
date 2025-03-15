import { eventHandler, readBody } from "h3"
import Stripe from "stripe"

const config = useRuntimeConfig()

const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY
const stripe = new Stripe(STRIPE_SECRET_KEY)

export default eventHandler(async (event) => {
    const { paymentOptions }: { paymentOptions: PaymentOptions } = await readBody(event)
    const origin = event.node.req.headers["origin"]

    try {
        const session = await stripe.checkout.sessions.create({
            ...paymentOptions,
            success_url: `${origin}/admin/dev?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}`,
        })

        return { sessionId: session.id }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error creating session ID: ${error}`,
        })
    }
})
