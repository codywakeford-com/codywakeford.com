import { deleteDoc, doc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { path } = await readBody(event)

    const docRef = doc(db, path)

    try {
        await deleteDoc(docRef)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
