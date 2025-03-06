import { doc, getDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { path } = await readBody(event)

    const docRef = doc(db, path)

    try {
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Resource not found",
            })
        }

        return {
            id: docSnap.id,
            ...docSnap.data(),
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
