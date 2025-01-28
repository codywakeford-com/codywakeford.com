export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    await $App.appStart()

    const isAuthenticated = await $User.isAuthenticated()
    if (!isAuthenticated) return navigateTo("/auth/login")
})
