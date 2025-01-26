import { collection, doc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, key, value } = await readBody(event)

    const colRef = collection(db, "projects")
    const docRef = doc(colRef, id)

    try {
        await updateDoc(docRef, { [key]: value })
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error updating ${key} with ${value}: ${error}`,
        })
    }
})
