import { jwtDecode } from "jwt-decode"

export default class AuthService {
    static async register(firstName: string, lastName: string, email: string, password: string) {
        await $fetch<Api.Auth.Register.Response>("/api/auth/register", {
            method: "POST",
            body: { firstName, lastName, email, password } as Api.Auth.Register.Request,
        })
    }

    static async login(email: string, password: string) {
        const jwt = await $fetch<Api.Auth.Login.Response>("/api/auth/login", {
            method: "POST",
            body: { email, password } as Api.Auth.Login.Request,
        })

        const payload = jwtDecode(jwt) as User

        if (!payload) {
            throw createError({
                statusCode: 500,
                message: "An unknown error occured",
            })
        }

        return {
            error: null,
            jwt: jwt,
            user: payload,
        }
    }

    static async validateJwt(jwt: string): Promise<boolean> {
        try {
            const { valid, payload } = await $fetch<Api.Auth.ValidateJwt.Response>("/api/auth/validate-jwt", {
                method: "POST",
                body: { token: jwt } as Api.Auth.ValidateJwt.Request,
            })

            if (valid) return true
            else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}
