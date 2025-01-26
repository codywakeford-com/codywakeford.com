import { collection, getDocs, query, where } from "firebase/firestore"
import bcrypt from "bcryptjs"
import { apiError, apiSuccess } from "~/utils/api"

export default eventHandler(async (event): Promise<ApiResponse<User>> => {
    const db = event.context.db
    const { email, password } = await readBody(event)

    if (!email || !password) {
        return apiError({
            statusCode: 400,
            message: "Server expects `email` & `password` in request body.",
        })
    }

    const userColRef = collection(db, "users")
    const q = query(userColRef, where("email", "==", email))

    try {
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return apiError({
                statusCode: 400,
                message: "Email or password is incorrect",
            })
        }

        const doc = querySnapshot.docs[0]
        let user = { id: doc.id, ...doc.data() } as $User

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
            const { password, ...userWithoutPassword } = user

            return apiSuccess(userWithoutPassword)
        } else {
            return apiError({
                statusCode: 400,
                message: "Email or password is incorrect",
            })
        }
    } catch (error) {
        return apiError({
            statusCode: 400,
            message: "And unknown error occured",
        })
    }
})
