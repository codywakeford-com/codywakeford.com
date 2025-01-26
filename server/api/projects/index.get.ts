import { collection, getDocs } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db

    const colRef = collection(db, "projects")
    const snapshot = await getDocs(colRef)

    const projectsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))

    return projectsArray || []
})
