import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export default defineNitroPlugin((nitro) => {
    const firebaseConfig = useRuntimeConfig().public.firebaseConfig

    const prod = process.env.NODE_ENV === "production"

    const databaseId = prod ? "prod" : "(default)"
    const bucketUrl = prod ? "gs://codywakeford-prod" : "gs://portfolio-1953f.firebasestorage.app"

    const app = initializeApp(firebaseConfig)
    const firestore = getFirestore(app, databaseId)
    const storage = getStorage(app, bucketUrl)

    nitro.hooks.hook("request", (event) => {
        event.context.storage = storage
        event.context.db = firestore
    })
})
