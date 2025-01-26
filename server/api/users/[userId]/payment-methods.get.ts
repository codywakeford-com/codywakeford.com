import { doc, getDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { userId } = event.context.params || {}

    try {
        const docRef = doc(db, `/users/${userId}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data() as User
            const paymentProfiles = data.paymentProfiles

            return paymentProfiles || []
        }

        throw createError({ statusCode: 404, statusMessage: "User not found" })
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500 })
    }
})
