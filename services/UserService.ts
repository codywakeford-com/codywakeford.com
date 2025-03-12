import PaymentService from "./PaymentService"

interface UserService_CreateUserObject {
    firstName: string
    lastName: string
    email: string
    password: string
}
export default class UserService {
    static async createUserObject(params: UserService_CreateUserObject) {
        const { firstName, lastName, email, password } = params

        const customerId = await PaymentService.createStripeCustomer(email)

        if (!customerId) throw new Error("customer id not working")

        const user: User = {
            ...params,
            role: "user",
            id: uuid(),
            profileColor: getRandomColor(),
            customerId,
        }

        return user
    }
}
