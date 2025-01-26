import { doc, getDoc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { userId, paymentProfileId } = event.context.params || {}

    if (!userId || !paymentProfileId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `userId`,`paymentProfileId` param",
        })
    }

    const docRef = doc(db, `users/${userId}`)
    const docSnap = await getDoc(docRef)

    try {
        if (docSnap.exists()) {
            const data = docSnap.data() as $User
            const paymentProfiles = data.paymentProfiles

            const filteredPaymentProfiles = paymentProfiles.filter((profile) => {
                return profile.paymentMethodId !== paymentProfileId
            })

            await updateDoc(docRef, {
                paymentProfiles: filteredPaymentProfiles,
            })
        }
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
