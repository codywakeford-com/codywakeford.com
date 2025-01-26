import { collection, doc, getDocs } from "firebase/firestore"

export default eventHandler(async (event) => {
    const db = event.context.db

    const colRef = collection(db, "projects")
    const snapshot = await getDocs(colRef)

    const projectsIdArray = snapshot.docs.map((doc) => (
        doc.id,
    ))

    return projectsIdArray || []
})
