import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, message }: { id: string; message: Message } =
        await readBody(event)

    if (!id || !message)
        throw createError({
            statusCode: 400,
            statusMessage: "id and message are required!",
        })

    message.timestamp = Date.now()

    const projectsColRef = collection(db, "projects")
    const projectDocRef = doc(projectsColRef, id)
    const messageColRef = collection(projectDocRef, "messages")

    try {
        await addDoc(messageColRef, message)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error adding message document: ${error}`,
        })
    }
})
