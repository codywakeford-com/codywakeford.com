import { render } from "@vue-email/render"
import Invite from "~/pages/emails/invite.vue"
export default eventHandler(async (event): Promise<Api.Emails.Invitation.Response> => {
    const { emails } = (await readBody(event)) as Api.Emails.Invitation.Request
    const resend = event.context.resend

    const html = await render(Invite, {
        title: "Hello",
    })

    try {
        for (let email of ["codypwakeford@gmail.com"]) {
            await resend.emails.send({
                from: "noreply@resend.codywakeford.com",
                to: email,
                subject: "An invitation to codywakeford.com!",
                html,
            })
        }
    } catch (e) {
        throw createError({
            statusCode: 500,
        })
    }
})
