import AuthService from "~~/services/AuthService"
import InitController from "./InitController"

export default class AuthController {
    static async register(firstName: string, lastName: string, email: string, password: string) {
        await AuthService.register(firstName, lastName, email, password)
    }

    static async login(email: string, password: string) {
        const response = await AuthService.login(email, password)

        if ("error" in response) {
            return { error: response.error }
        } else {
            localStorage.setItem("jwt", response.jwt)
            $User.state.jwt = response.jwt
            $User.state.user = response.user

            InitController.initProjectListeners($User.state.user.email)
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
