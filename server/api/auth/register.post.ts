import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import bcrypt from "bcryptjs"
import { apiError, apiSuccess } from "~/utils/api"

export default eventHandler(async (event): Promise<ApiResponse<null>> => {
    const db = event.context.db
    const { email, password, domain, role } = await readBody(event)

    if (!email || !password) {
        return apiError({
            statusCode: 400,
            message: "Server expects `email` & `password` in request body.",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userColRef = collection(db, "users")
    const q = query(userColRef, where("email", "==", email))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
        return apiError({
            statusCode: 401,
            message: "User already exists",
        })
    }

    const user: Omit<$User, "id"> = {
        email: email,
        password: hashedPassword,
        siteAccess: [{ domain: domain, role: role }],
    }

    try {
        await addDoc(userColRef, user)

        return apiSuccess(null)
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `Error adding user to db: ${error}` })
    }
})
