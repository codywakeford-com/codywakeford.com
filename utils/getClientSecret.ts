import type Stripe from "stripe";

export async function getPaymentSecret(
    paymentOptions: Stripe.PaymentIntentCreateParams,
): Promise<string> {
    console.log(paymentOptions);
    const { clientSecret } = await $fetch<{ clientSecret: string }>(
        "/api/stripe/create-payment-intent",
        {
            method: "POST",
            body: paymentOptions,
        },
    );

    if (!clientSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch client secret.",
        });
    }

    return clientSecret;
}

export async function getSetupIntentSecret(customerId: Stripe.Customer["id"]) {
    const { clientSecret } = await $fetch<{ clientSecret: string }>(
        "/api/stripe/create-setup-intent",
        {
            method: "POST",
            body: { customerId },
        },
    );

    if (!clientSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch setup intent secret.",
        });
    }

    return { clientSecret, customerId };
}
