import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
import { eventHandler } from "h3"

export default eventHandler(async (event) => {
    const db = event.context.db

    const params = event.context.params || {}
    const email = params.email as string

    if (!email) {
        return {
            status: 400,
            message: "Email parameter is required",
        }
    }

    const usersColRef = collection(db, "users")
    const q = query(usersColRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return {
            status: 404,
            message: "User not found",
        }
    }

    const userDoc = querySnapshot.docs[0]
    const userRef = doc(db, "users", userDoc.id)

    try {
        await deleteDoc(userRef)

        return {
            status: 200,
            message: "User deleted updated successfully",
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return {
            status: 500,
            message: "Error deleting user ",
        }
    }
})
