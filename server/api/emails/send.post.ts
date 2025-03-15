import type { Resend, CreateEmailOptions, CreateEmailRequestOptions } from "resend"

export namespace ApiEmails_Send {
    export interface ReqBody {
        payload: CreateEmailOptions
        options?: CreateEmailRequestOptions
    }
}

export default eventHandler(async (event) => {
    const { payload, options } = (await readBody(event)) as ApiEmails_Send.ReqBody
    const resend = event.context.resend as Resend

    try {
        await resend.emails.send(payload, options)

        return 200
    } catch (e) {
        throw createError({
            statusCode: 500,
        })
    }
})
