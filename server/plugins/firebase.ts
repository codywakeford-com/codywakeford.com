import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

export default defineNitroPlugin((nitro) => {
    const firebaseConfig = useRuntimeConfig().public.firebaseConfig

    const app = initializeApp(firebaseConfig)
    const firestore = getFirestore(app)

    nitro.hooks.hook("request", (event) => {
        event.context.db = firestore
    })
})
