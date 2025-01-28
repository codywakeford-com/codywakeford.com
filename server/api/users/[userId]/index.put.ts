import { doc, getDoc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { userId } = event.context.params || {}

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `userId` query param.",
        })
    }

    const body = await readBody(event)

    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Request body must contain at least one field to update.",
        })
    }

    const docRef = doc(db, `/users/${userId}`)

    try {
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: `User document with ID ${userId} does not exist.`,
            })
        }

        await updateDoc(docRef, body)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error.message,
        })
    }
})
