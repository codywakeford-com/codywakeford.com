import { jwtDecode } from "jwt-decode"

type LoginSuccess = { jwt: string; user: User }
type LoginFailure = { error: string }

export default class AuthService {
    static async register(email: string, password: string) {
        try {
            await $fetch<Api.Auth.Register.Response>("/api/auth/register", {
                method: "POST",
                body: { email, password } as Api.Auth.Register.Request,
            })
        } catch (error) {
            return error
        }
    }

    static async login(
        email: string,
        password: string,
    ): Promise<LoginSuccess | LoginFailure> {
        try {
            const jwt = await $fetch<Api.Auth.Login.Response>(
                "/api/auth/login",
                {
                    method: "POST",
                    body: { email, password } as Api.Auth.Login.Request,
                },
            )

            const payload = jwtDecode(jwt) as User

            if (!payload) {
                return { error: "An error has occurred." }
            }

            return {
                jwt: jwt,
                user: payload,
            }
        } catch (error: any) {
            if (error.status === 401) {
                return { error: "Invalid email or password." }
            } else {
                return { error: "An unknown error has occurred." }
            }
        }
    }

    static async validateJwt(jwt: string): Promise<boolean> {
        try {
            const { valid, payload } =
                await $fetch<Api.Auth.ValidateJwt.Response>(
                    "/api/auth/validate-jwt",
                    {
                        method: "POST",
                        body: { token: jwt } as Api.Auth.ValidateJwt.Request,
                    },
                )

            if (valid) return true
            else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}
