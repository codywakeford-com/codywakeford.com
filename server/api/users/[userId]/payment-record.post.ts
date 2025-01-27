import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { paymentRecord, projectId } = await readBody(event)
    const { userId } = event.context.params || {}

    if (!userId) {
        console.log("Server expects `userId` param")
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `userId` param",
        })
    }

    if (!paymentRecord || !projectId) {
        console.log("Server expects `paymentRecord` and `projectId` in request body.")
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Server expects `paymentRecord` and `projectId` in request body.",
        })
    }

    let serverPaymentRecord: $PaymentRecord = {
        ...paymentRecord,
        userId: userId,
        projectId: projectId,
    }

    const userColRef = collection(db, `/users/${userId}/payment-records`)
    const projectColRef = collection(db, `projects/${projectId}/payment-records`)
    const projectDocRef = doc(db, `/projects/${projectId}`)

    try {
        const docSnap = await getDoc(projectDocRef)

        if (!docSnap.exists) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not found",
                message: "Project not found",
            })
        }

        const project = {
            ...docSnap.data(),
        } as Project

        if (!project.quote) {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "An unexpected error occurred",
            })
        }

        project.quote.amountPaid += paymentRecord.totalPaid
        await updateDoc(projectDocRef, { quote: project.quote })

        await addDoc(userColRef, serverPaymentRecord)
        await addDoc(projectColRef, serverPaymentRecord)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "An unexpected error occurred",
        })
    }
})
