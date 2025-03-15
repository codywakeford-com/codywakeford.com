import { collection, getDocs, query, Query, where } from "firebase/firestore"

type ReturnType = Promise<Api.Projects.Email.Return>
type RequestType = Api.Projects.Email.Request

export default eventHandler(async (event): ReturnType => {
    const db = event.context.db
    const { email } = event.context.params || ({} as Api.Projects.Email.Request)

    if (!email) {
        throw createError({
            statusCode: 400,
            message: "Server expects email param",
        })
    }

    try {
        const colRef = collection(db, "projects")
        const q = query(colRef, where("emails", "array-contains", email))
        const querySnapshot = await getDocs(q)

        const projectIds = querySnapshot.docs.map((doc) => doc.id)

        return { ids: projectIds }
    } catch (error) {
        console.error("Error fetching projects:", error)
        throw createError({
            statusCode: 500,
        })
    }
})
