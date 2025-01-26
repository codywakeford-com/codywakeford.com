import { collection, getDocs, query, Query, where } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { email } = event.context.params || {}

    console.log(email)
    if (!email) {
        throw new Error("Email parameter is required")
    }

    try {
        const colRef = collection(db, "projects")

        const q = query(colRef, where("emails", "array-contains", email))

        const querySnapshot = await getDocs(q)

        const projectIds = querySnapshot.docs.map((doc) => doc.id)
        return projectIds
    } catch (error) {
        console.error("Error fetching projects:", error)
        throw createError({
            statusCode: 500,
        })
    }
})
