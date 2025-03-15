import type {
    PaymentIntent,
    PaymentMethodCreateParams,
    StripeCardElement,
    StripeCardNumberElement,
} from "@stripe/stripe-js"

export {}

declare global {
    interface UserPaymentMethod {
        paymentMethodId: string
        billing: BillingAddress
        timestamp: number
        expiry: string
        last4: string
        nameOnCard: string
        brand: "mastercard" | "amex" | "visa"
    }

    interface PaymentMethodMetadata {
        last4: string
        expiry: string
        brand: "mastercard" | "amex" | "visa"
    }

    interface PaymentRecord {
        projectId: string
        userId: string
        paymentIntent: PaymentIntent
        timestamp: number
        billing: BillingAddress
    }

    interface BillingAddress {
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

    interface PaymentController_SetupPaymentMethod {
        stripe: StripeClient
        cardElement: StripeCardElement | StripeCardNumberElement
        billing: BillingAddress
    }

    interface PaymentService_SavePaymentMethod {
        setupIntent: SetupIntent
        userId: string
        billingAddress: BillingAddress
    }

    interface PaymentService_SetupPaymentMethod {
        stripe: StripeClient
        cardElement: StripeCardElement | StripeCardNumberElement
        billing: BillingAddress
        customerId: string
    }
}
