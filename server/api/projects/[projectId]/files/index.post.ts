import { addDoc, collection } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { file }: { file: ProjectFile } = await readBody(event)
    const { projectId } = event.context.params || {}

    if (!projectId || !file) {
        throw createError({
            statusCode: 400,
            statusMessage: "Server expects `id`, `file`",
        })
    }

    const colRef = collection(db, `projects/${projectId}/files`)

    try {
        const docRef = await addDoc(colRef, file)

        return docRef.id
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `An error occured while adding a document to the project: ${error}`,
        })
    }
})
