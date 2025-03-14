import AuthService from "~~/services/AuthService"
import InitController from "./InitController"

export default class AuthController {
    static async register(firstName: string, lastName: string, email: string, password: string) {
        try {
            await AuthService.register(firstName, lastName, email, password)

            return { error: null }
        } catch (e: any) {
            const code = e.statusCode as number

            switch (code) {
                case 409:
                    return { error: "Email is already in use" }
                default:
                    return { error: "An unknown error occured" }
            }
        }
    }

    static async login(email: string, password: string) {
        const $User = useUserStore()
        try {
            const { jwt, user } = await AuthService.login(email, password)

            localStorage.setItem("jwt", jwt)
            $User.state.jwt = jwt
            if (user) $User.state.user = user

            InitController.initProjectListeners($User.state.user.email)

            navigateTo("/dashboard/client")
            return { error: null }
        } catch (e) {
            if (e && typeof e === "object" && "statusCode" in e) {
                const error = e as { statusCode: number; statusMessage?: string }

                switch (error.statusCode) {
                    case 401:
                        return { error: "Invalid email or password" }
                    default:
                        console.error("Unexpected error:", error)
                        return { error: "An unknown error occurred" }
                }
            }

            return { error: "An unknown error occurred" }
        }
    }

    static logout() {
        const $User = useUserStore()
        const $Projects = useProjectStore()

        $User.state.user = null
        $Projects.state.projects = []

        localStorage.removeItem("user")
        localStorage.removeItem("jwt")

        return navigateTo("/")
    }
}
