import jwt from "jsonwebtoken"

export default eventHandler(async (event): Promise<Api.Auth.ValidateJwt.Response> => {
    const secret = useRuntimeConfig().SECRET_KEY
    const { token } = (await readBody(event)) as Api.Auth.ValidateJwt.Request

    try {
        const decoded = jwt.verify(token, secret)

        return { valid: true, payload: decoded }
    } catch (e) {
        throw createError({
            statusCode: 401,
            message: "Invalid or expired token",
        })
    }
})
