import { addDoc, collection, doc, setDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { path, data }: Request = await readBody(event)

    const colRef = collection(db, path)

    try {
        if (!data.id) {
            const doc = await addDoc(colRef, data)
            return doc.id
        }

        if (data.id) {
            const docRef = doc(colRef, data.id)
            await setDoc(docRef, data)

            return docRef.id
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})

interface Request {
    path: string
    data: any
}
