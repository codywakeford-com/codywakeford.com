import { collection, getDocs } from "firebase/firestore"
import { eventHandler } from "h3"

export default eventHandler(async (event) => {
    const db = event.context.db

    const itemsColRef = collection(db, "users")
    const docSnap = await getDocs(itemsColRef)

    const users = docSnap.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        }
    })

    return users
})
