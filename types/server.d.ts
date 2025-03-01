export { }

declare global {
    namespace Api {
        namespace Auth {
            namespace Login {
                interface Request {
                    email: string
                    password: string
                }

                type Response = string
            }

            namespace Register {
                interface Request {
                    email: string
                    password: string
                    role?: User["role"]
                }
                type Response = null
            }

            namespace ValidateJwt {
                type Request = {
                    token: string
                }

                interface Response {
                    valid: boolean
                    payload: any
                }
            }
        }
    }
}
