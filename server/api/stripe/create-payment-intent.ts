import Stripe from "stripe";

const config = useRuntimeConfig();

const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
});

export default defineEventHandler(async (event): Promise<ReturnType> => {
    const paymentOptions: Stripe.PaymentIntentCreateParams =
        await readBody(event);

    console.log(paymentOptions);

    try {
        const paymentIntent = await stripe.paymentIntents.create(paymentOptions);

        return { clientSecret: paymentIntent.client_secret };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error creating client secret: ${error}`,
        });
    }
});

interface ReturnType {
    clientSecret: Stripe.PaymentIntent["client_secret"];
}
