// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    imports: { dirs: ["./controllers"] },

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

    scripts: {
        registry: {
            stripe: true,
            googleAnalytics: { id: process.env.FIREBASE_MEASUREMENT_ID || "" },
        },
    },

    runtimeConfig: {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SECRET_KEY: process.env.SECRET_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        public: {
            STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
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

    extends: [["../nova-components", { install: true }]],

    css: ["@/style/main.scss", "@/style/modal.scss"],
    modules: ["@nuxt/fonts", "@pinia/nuxt", "nuxt-calendly", "@nuxt/icon", "@nuxt/scripts", "pinia-plugin-persistedstate/nuxt"],
})
