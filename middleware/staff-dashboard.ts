import { jwtDecode } from "jwt-decode"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    await $App.appStart()

    console.log($User.jwt)

    if (!$User.jwt) {
        return navigateTo("/auth/login")
    }

    if (!(await $User.validateJwt($User.jwt))) {
        return navigateTo("/auth/login")
    }

    const user = jwtDecode($User.jwt) as User
    if (user.role !== "staff") {
        return navigateTo("/")
    }
})
