import { Resend } from "resend"

export default defineNitroPlugin((nitro) => {
  const key = useRuntimeConfig().RESEND_API_KEY
  const resend = new Resend(key)

  nitro.hooks.hook("request", (event) => {
    event.context.resend = resend
  })
})
