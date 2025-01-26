import { collection, doc, updateDoc } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db
    const { notificationId, read, userId } = await readBody(event)

    const usersColRef = collection(db, "users")
    const userDocRef = doc(usersColRef, userId)
    const userNotificationColRef = collection(userDocRef, "notifications")
    const docRef = doc(userNotificationColRef, notificationId)

    try {
        await updateDoc(docRef, { read: read })
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error updating notification read status: ${error}`,
        })
    }
})
