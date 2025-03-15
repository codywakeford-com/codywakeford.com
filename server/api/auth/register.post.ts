import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import bcrypt from "bcryptjs"
import { uuid } from "~/utils/uuid"

export default eventHandler(async (event): Promise<Api.Auth.Register.Response> => {
    const db = event.context.db
    const { firstName, lastName, email, password, role } = (await readBody(event)) as Api.Auth.Register.Request

    console.log(await readBody(event))
    if (!firstName || !lastName || !email || !password) {
        throw createError({
            statusCode: 400,
            message: "Server expects `email` & `password` in request body.",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userColRef = collection(db, "users")
    const q = query(userColRef, where("email", "==", email))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
        throw createError({
            statusCode: 409,
            message: "User already exists",
        })
    }

    const user: User = {
        id: uuid(),
        firstName,
        lastName,
        password: hashedPassword,
        email: email,
        role: role ? role : "user",
        stripePaymentProfile: {
            customerId: "",
            paymentMethods: [],
        },
    }

    try {
        const userRef = doc(userColRef, user.id)
        await setDoc(userRef, user)

        return null
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `Error adding user to db: ${error}` })
    }
})
