import { collection, doc, getDoc, updateDoc } from "firebase/firestore"
export default eventHandler(async (event) => {
    const db = event.context.db
    const { id, amountPaid } = await readBody(event)

    const colRef = collection(db, "projects")
    const docRef = doc(colRef, id)

    try {
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) return

        const data = snapshot.data() as Project

        if (!data || !data.quote) {
            throw createError({ statusCode: 404, statusMessage: "Project quote not found!" })
        }

        data.quote.amountPaid += amountPaid

        await updateDoc(docRef, { quote: data.quote })
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `Error reading document: ${error}` })
    }
})
