import { collection, getDocs, query } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { email } = event.context.params || {}

    console.log("hereere")

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: "Server expects `email` param" })
    }

    let projectIds: string[] = []
    try {
        projectIds = await $fetch<Project["id"][]>(`/api/projects/${email}`)
    } catch (error) {
        console.error(error)
    }

    console.log("projectIds", projectIds)
    const allFiles: any[] = []

    try {
        for (const projectId of projectIds) {
            const filesColRef = collection(db, `projects/${projectId}/files`)

            const querySnapshot = await getDocs(query(filesColRef))

            const files = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            allFiles.push(...files)
        }

        return allFiles
    } catch (error) {
        console.error("Error fetching files:", error)
        return {
            success: false,
            error: "Failed to fetch files from subcollections",
        }
    }
})
