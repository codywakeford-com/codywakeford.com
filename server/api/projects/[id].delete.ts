import { collection, deleteDoc, doc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const id = event.context.params?.id

    if (!id) throw createError({ statusCode: 400, statusMessage: "Id not found!" })

    const colRef = collection(db, "projects")
    const docRef = doc(colRef, id)

    try {
        await deleteDoc(docRef)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error deleting project document ${error}`,
        })
    }
})
