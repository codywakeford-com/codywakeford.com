import { doc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { project } = await readBody(event)

    if (!project) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `project` in request body",
        })
    }

    const docRef = doc(db, `/projects/${project.id}`)

    try {
        await updateDoc(docRef, project)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
