import { collection, doc, getDoc, query, updateDoc, where } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { paymentMethod } = await readBody(event)
    const { userId } = event.context.params || {}

    const docRef = doc(db, `users/${userId}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        const user = docSnap.data() as $User
        const customerId = user.stripePaymentProfile?.customerId
        const paymentMethods = user.stripePaymentProfile?.paymentMethods
        paymentMethods.push(paymentMethod)

        try {
            await updateDoc(docRef, {
                stripePaymentProfile: {
                    customerId: customerId,
                    paymentMethods: paymentMethods,
                },
            })
        } catch (error) {
            console.error(error)
            throw createError({ statusCode: 500 })
        }
    }
})
