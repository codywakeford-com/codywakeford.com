import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { eventHandler, readBody } from "h3"

export default eventHandler(async (event) => {
    const { email, newRole } = (await readBody(event)) as {
        email: string
        newRole: string
    }

    if (!email || !newRole) {
        return {
            status: 400,
            message: "Email and newRole are required",
        }
    }

    const db = event.context.db

    // Create a query to find the user by email
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
        await updateDoc(userRef, {
            role: newRole,
        })

        return {
            status: 200,
            message: "User role updated successfully",
        }
    } catch (error) {
        console.error("Error updating user role:", error)
        return {
            status: 500,
            message: "Error updating user role",
        }
    }
})
