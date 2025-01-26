import {
    arrayUnion,
    collection,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    addDoc,
    getDocs,
} from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, document } = await readBody(event)

    if (!id || !document) {
        throw createError({
            statusCode: 400,
            statusMessage: "/api/projects/document is missing either id or document permameters.",
        })
    }

    const colRef = collection(db, "projects")
    const docRef = doc(colRef, id)
    const documentsColRef = collection(docRef, "project-documents")

    try {
        const snapshot = await getDocs(documentsColRef)

        return snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `An error occured while adding a document to the project: ${error}`,
        })
    }
})
