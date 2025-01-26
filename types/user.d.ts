export {}

declare global {
    interface UserObj {
        id: string
        email: string
        role: string
    }

    type UserRole = "staff" | "user"

    interface SiteAccess {
        domain: string
        role: UserRole
    }

    export type User = Omit<$User, "password">

    interface $User {
        id: string
        password: string
        email: string
        siteAccess: SiteAccess[]

        stripePaymentProfile: StripePaymentProfile
    }
}
