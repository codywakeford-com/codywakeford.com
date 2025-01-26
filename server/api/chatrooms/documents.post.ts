import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, document } = await readBody(event)

    if (!id || !document) {
        throw createError({ statusCode: 400, statusMessage: "id and document required!" })
    }

    document.timestamp = serverTimestamp()

    const projectsColRef = collection(db, "projects")
    const projectDocRef = doc(projectsColRef, id)
    const documentsColRef = collection(projectDocRef, "documents")

    try {
        await addDoc(documentsColRef, document)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to add document to firestore: ${error}`,
        })
    }
})
