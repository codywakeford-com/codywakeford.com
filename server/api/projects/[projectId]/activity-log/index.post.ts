import { addDoc, collection, getDocs } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { projectId } = event.context.params || {}
    const { activity } = await readBody(event)

    if (!projectId || !activity) {
        throw createError({
            statusCode: 400,
            statusMessage: "Server expects `projectId` param, `activity` in request body.",
        })
    }

    const colRef = collection(db, `/projects/${projectId}/activity-log`)
    try {
        const docRef = await addDoc(colRef, activity)

        return docRef.id
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `An error occured while adding a document to the project: ${error}`,
        })
    }
})
