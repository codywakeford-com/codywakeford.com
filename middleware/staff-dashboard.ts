import { jwtDecode } from "jwt-decode"
import AuthService from "~/services/AuthService"

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) return

    await $App.appStart()

    if (!$User.state.jwt) {
        return navigateTo("/auth/login")
    }

    if (!(await AuthService.validateJwt($User.state.jwt))) {
        return navigateTo("/auth/login")
    }

    const user = jwtDecode($User.state.jwt) as User
    if (user.role !== "staff") {
        return navigateTo("/")
    }
})
