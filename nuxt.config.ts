// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    sourcemap: {
        server: true,
        client: true,
    },
    ssr: false,
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/style/variables.scss" as *;',
                },
            },
        },
    },

    runtimeConfig: {
        public: {
            CALENDLY_PAT: process.env.CALENDLY_PAT,
            firebaseConfig: {
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                projectId: process.env.FIREBASE_PROJECT_ID,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.FIREBASE_APP_ID,
                measurementId: process.env.FIREBASE_MEASUREMENT_ID,
            },
        },
    },

    extends: [
        ["../nova-components", { install: true }],
        ["../novatek-email", { install: true }],
        ["../novatek-payments", { install: true }],
        ["../firebase-service", { install: true }],
    ],

    css: ["@/style/main.scss"],
    modules: ["@nuxt/fonts", "@pinia/nuxt", "nuxt-calendly"],
})
