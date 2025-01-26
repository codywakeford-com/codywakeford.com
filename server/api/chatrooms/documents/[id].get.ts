import { collection, doc, getDocs, orderBy, query } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const id = event.context.params?.id

    const projectsColRef = collection(db, "projects")
    const projectDocRef = doc(projectsColRef, id)
    const documentsColRef = collection(projectDocRef, "documents")

    try {
        const messagesQuery = query(documentsColRef, orderBy("timestamp", "desc"))

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
