import AuthService from "~~/services/AuthService"

export default class AuthController {
    static async register(email: string, password: string) {
        await AuthService.register(email, password)
    }

    static async login(email: string, password: string) {
        const response = await AuthService.login(email, password)

        if ("error" in response) {
            return { error: response.error }
        } else {
            localStorage.setItem("jwt", response.jwt)
            $User.state.user = response.user
        }
    }

    static logout() {
        $User.state.user = null
        $Projects.state.projects = []

        localStorage.removeItem("user")
        localStorage.removeItem("jwt")

        return navigateTo("/")
    }
}
