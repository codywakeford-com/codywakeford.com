import { collection, doc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, phase } = await readBody(event)

    if (!id || !phase)
        throw createError({ statusCode: 400, statusMessage: "Id and status are required!" })

    const colRef = collection(db, "projects")
    const docRef = doc(colRef, id)

    try {
        await updateDoc(docRef, { phase: phase })
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error updating document status: ${error}`,
        })
    }
})
