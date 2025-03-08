import type { PaymentIntent, PaymentMethodCreateParams } from "@stripe/stripe-js"

export {}

declare global {
    interface PaymentRecord {
        projectId: string
        userId: string
        paymentIntent: PaymentIntent
        timestamp: number
        billing: {
            name: string
            email: string
            address: {
                line1: string
                line2: string | null
                city: string
                state: string
                postcode: string
                country: string
                state: string
            }
        }
    }
}
