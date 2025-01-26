import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore"
import { readBody } from "h3"

export default defineEventHandler(async (event) => {
    const db = event.context.db

    const { notification }: { notification: CreateNotification; userIds: string[] } =
        await readBody(event)

    if (!notification) throw createError({ statusCode: 400 })

    const style = getStyle(notification)
    notification.timestamp = new Date().toISOString()
    notification.read = false
    notification.style = style

    if (!notification.action) {
        notification.action = {
            type: "none",
        }
    }

    const usersColRef = collection(db, "users")

    for (const email of notification.to) {
        const q = query(usersColRef, where("email", "==", email))
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(async (userDoc) => {
            const userDocRef = doc(db, "users", userDoc.id)
            const userNotificationColRef = collection(userDocRef, "notifications")

            try {
                await addDoc(userNotificationColRef, notification)
            } catch (error: any) {
                throw createError({
                    statusCode: 500,
                    statusMessage: `Error adding notification for user with email ${email}: ${error.message}`,
                })
            }
        })
    }
})

function getStyle(notification: CreateNotification) {
    let style = {
        icon: "",
        backgroundColor: "",
    }

    switch (notification.type) {
        case "store":
            style["icon"] = "ic:baseline-store"
            break
        case "order":
            style["icon"] = "material-symbols:quick-reorder-outline"
            break
        case "blog":
            style["icon"] = "material-symbols:edit-outline"
            break
        case "client":
            style["icon"] = "streamline:information-desk-customer"
            break
        case "project":
            style["icon"] = "octicon:project"
    }

    switch (notification.mode) {
        case "danger":
            style["backgroundColor"] = "#F7A1A1"
            break
        case "success":
            style["backgroundColor"] = "#A7C7E7"
            break
        case "info":
            style["backgroundColor"] = "#F7A1A1"
            break
        case "warning":
            style["backgroundColor"] = "#FEE4A1"
            break
    }

    return style
}
