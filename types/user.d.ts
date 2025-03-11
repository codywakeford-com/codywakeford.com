export {}

declare global {
    interface User {
        id: string
        firstName: string
        lastName: string
        password: string
        email: string
        role: UserRole
        customerId: string
    }

    type UserRole = "staff" | "user"

    interface $PaymentRecord extends PaymentRecord {
        projectId: Project["id"]
        userId: User["id"]
    }
}
