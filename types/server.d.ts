export { }

declare global {
    namespace Api {
        namespace Emails {
            namespace Invitation {
                type Response = undefined

                interface Request {
                    emails: string[]
                }
            }
        }

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
