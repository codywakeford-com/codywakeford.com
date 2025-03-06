import { collection, getDocs } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { path } = await readBody(event)

    const colRef = collection(db, path)

    try {
        const docSnap = await getDocs(colRef)

        if (docSnap.empty) {
            return []
        }

        return docSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
