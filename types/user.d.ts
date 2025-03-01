export { }

declare global {
    interface UserObj {
        id: string
        email: string
        role: UserRole
    }

    type UserRole = "staff" | "user"
    type User = Omit<$User, "password">

    interface $User {
        id: string
        password: string
        email: string
        role: UserRole

        stripePaymentProfile?: StripePaymentProfile
    }

    interface $PaymentRecord extends PaymentRecord {
        projectId: Project["id"]
        userId: User["id"]
    }
}
