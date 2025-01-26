import { collection, getDocs } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { projectId } = event.context.params || {}

    if (!projectId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Server expects `projectId` param",
        })
    }

    const colRef = collection(db, `/projects/${projectId}/activity-log`)
    const snapshot = await getDocs(colRef)

    try {
        const docs = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })

        return docs
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
