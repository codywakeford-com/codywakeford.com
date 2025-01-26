import { collection, getDocs, query, where } from "firebase/firestore"
import { eventHandler } from "h3"
import { apiError, apiSuccess } from "~/utils/api"

export default eventHandler(async (event): Promise<ApiResponse<User>> => {
    const db = event.context.db
    const { email } = event.context.params || {}

    const colRef = collection(db, "users")
    const q = query(colRef, where("email", "==", email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return apiError({
            statusCode: 404,
            message: "User not found",
        })
    }

    const userDoc = querySnapshot.docs[0]
    const user = {
        id: userDoc.id,
        ...userDoc.data(),
    } as User

    return apiSuccess(user)
})
