import { collection, doc, getDocs } from "firebase/firestore"

export default eventHandler(async (event): Promise<AppNotification[]> => {
    const db = event.context.db
    // const { id } = await readBody(event)

    if (!event.context?.params?.uid) {
        throw createError({ statusCode: 400, statusMessage: "id parameter required" })
    }

    const uid = event.context.params.uid

    const usersColRef = collection(db, "users")
    const userDocRef = doc(usersColRef, uid)
    const userNotificationColRef = collection(userDocRef, "notifications")

    try {
        const snapShot = await getDocs(userNotificationColRef)

        const notifications = snapShot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as AppNotification)
        )

        return notifications
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: `Error getting notifications` })
    }
})
