export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    if (!piniaInitialized) {
        await initPiniaStores()
    }

    const isAuthenticated = await $User.isAuthenticated()
    console.log(isAuthenticated)
    if (!isAuthenticated) return navigateTo("/auth/login")
})
