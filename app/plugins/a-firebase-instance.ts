// plugins/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

import type { FirebaseApp } from "firebase/app"
import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

export default defineNuxtPlugin(() => {
    const firebaseConfig = useRuntimeConfig().public.firebaseConfig

    let app: FirebaseApp | undefined
    let auth: Auth | undefined
    let db: Firestore | undefined
    let storage: FirebaseStorage | undefined

    const prod = process.env.NODE_ENV === "production"

    const databaseId = prod ? "prod" : "(default)"
    const bucketUrl = prod ? "gs://codywakeford-prod" : "gs://portfolio-1953f.firebasestorage.app"

    console.log("using", databaseId)

    try {
        // Initialize Firebase apps
        app = initializeApp(firebaseConfig)
        db = getFirestore(app, databaseId)
        storage = getStorage(app, bucketUrl)
        auth = getAuth(app)

        console.log("Firebase client app, auth, db, and storage initialized.")
    } catch (error) {
        console.error("Error creating Firestore instance", error)
    }

    // Provide the Firebase services to the Nuxt app context
    useNuxtApp().provide("db", db)
    useNuxtApp().provide("storage", storage)
    useNuxtApp().provide("auth", auth)
})
