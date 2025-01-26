import { doc, getDoc } from "firebase/firestore"
import { eventHandler, getQuery } from "h3"

export default eventHandler(async (event): Promise<User["siteAccess"]> => {
    const db = event.context.db

    const query = getQuery(event)
    const id = query.uid as User["id"]

    if (!id) {
        console.error("Document ID not provided")
        throw createError({
            statusCode: 400,
            statusMessage: "id required",
        })
    }

    try {
        const docRef = doc(db, "users", id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw createError({
                statusCode: 404,
                statusMessage: "Document not found",
            })
        }

        const userObj = docSnap.data() as User
        return userObj.siteAccess || []
    } catch (error) {
        console.error("Error fetching document: ", error)
        throw createError({ statusCode: 500, statusMessage: `${error}` })
    }
})
