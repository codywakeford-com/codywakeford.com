import { collection, getDocs, query, where } from "firebase/firestore"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default eventHandler(async (event): Promise<ApiAuthLogin.Response> => {
    const db = event.context.db
    const secretKey = useRuntimeConfig().SECRET_KEY
    const { email, password } = (await readBody(event)) as ApiAuthLogin.Request

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            message: "Server expects `email` & `password` in request body.",
        })
    }

    const userColRef = collection(db, "users")
    const q = query(userColRef, where("email", "==", email))

    try {
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            throw createError({
                statusCode: 401,
                message: "Email or password is incorrect",
            })
        }

        const doc = querySnapshot.docs[0]
        let user = { id: doc.id, ...doc.data() } as $User

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
            const { password, ...userWithoutPassword } = user

            const token = jwt.sign(userWithoutPassword, secretKey)

            return token
        } else {
            throw createError({
                statusCode: 401,
                message: "Email or password is incorrect",
            })
        }
    } catch (error) {
        console.log(error)
        throw createError({
            statusCode: 500,
            message: "And unknown error occured",
        })
    }
})
