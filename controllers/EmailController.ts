import type { CreateEmailOptions, CreateEmailRequestOptions } from "resend"
import type { ApiEmails_Send } from "~~/server/api/emails/send.post"

export default class EmailController {
    static async sendEmail(payload: CreateEmailOptions, options?: CreateEmailRequestOptions) {
        try {
            await $fetch(`/api/emails/send`, {
                method: "POST",
                body: { payload, options } as ApiEmails_Send.ReqBody,
            })

            return { error: null, success: "Your email has been recieved, I'll get back to you shortly." }
        } catch (e) {
            console.log(e)

            return { error: "An unknown error occurred. Feel free to email at cody@codywakeford.com", success: null }
        }
    }
}
