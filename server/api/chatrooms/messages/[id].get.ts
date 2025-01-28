import { collection, doc, getDocs, orderBy, query } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const id = event.context.params?.id

    const projectsColRef = collection(db, "projects")
    const projectDocRef = doc(projectsColRef, id)
    const messagesColRef = collection(projectDocRef, "messages")

    try {
        const messagesQuery = query(messagesColRef, orderBy("timestamp", "desc"))

        const snapshot = await getDocs(messagesQuery)
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        return messages
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `Error getting messages: ${error}` })
    }
})
