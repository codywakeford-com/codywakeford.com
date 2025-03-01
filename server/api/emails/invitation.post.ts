export default eventHandler(async (event) => {
    const key = useRuntimeConfig().RESEND_API_KEY
    const resend = event.context.resend

    resend.emails.send({
        from: "onboarding@resend.dev",
        to: "codypwakeford@gmail.com",
        subject: "Hello World",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    })
})
