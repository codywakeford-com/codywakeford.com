export default eventHandler(async (event): Promise<Api.Emails.Invitation.Response> => {
    const { emails } = (await readBody(event)) as Api.Emails.Invitation.Request
    const resend = event.context.resend

    console.log("herererer")

    try {
        for (let email of emails) {
            await resend.emails.send({
                from: "noreply@resend.io",
                to: email,
                subject: "An invitation to codywakeford.com!",
                html: `
            <!DOCTYPE html>
            <html>
            <head>
            <title>Invitation to codywakeford.com</title>
            <style>
            body { font-family: sans-serif; }
            .container { padding: 20px; }
            .button {
            background-color: #007bff;
            color: var(--text1);
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            }
            </style>
            </head>
            <body>
            <div class="container">
            <h1>You're Invited!</h1>
            <p>I'm excited to invite you to our client portal, as part of my service I have built a place where we can easily manage your web development project together. This portal will allow you to track progress, share feedback, and stay updated on everything in one place.</p>
            <a href="https://codywakeford.com/auth/register" class="button">Access Client Portal</a>
            </div>
            </body>
            </html>
            `,
            })
        }
    } catch (e) {
        throw createError({
            statusCode: 500,
        })
    }
})
