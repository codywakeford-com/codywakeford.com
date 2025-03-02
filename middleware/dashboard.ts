export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    await $App.appStart()

    if (!$User.state.jwt) {
        return navigateTo("/auth/login")
    }

    if (!(await $User.validateJwt($User.state.jwt))) {
        return navigateTo("/auth/login")
    }
})
