import { addDoc, collection } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { project }: { project: Project } = await readBody(event)

    if (!project) {
        throw createError({
            statusCode: 400,
            statusMessage: "No project data found",
        })
    }

    try {
        const colRef = collection(db, "projects")
        const doc = await addDoc(colRef, project)
        return doc.id
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Unable to create project: ${error}`,
        })
    }

    // TODO: send email to project.email[] when this is added.
})
