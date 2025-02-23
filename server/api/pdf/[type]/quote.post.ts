import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import {
    ref,
    getStorage,
    uploadBytes,
    getDownloadURL,
    FirebaseStorage,
} from "firebase/storage"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default eventHandler(async (event) => {
    const storage = event.context.storage as FirebaseStorage
    const quote = await readBody(event)
    console.log(quote)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setViewport({ width: 1240, height: 1754 })

    const encodedQuote = encodeURIComponent(JSON.stringify(quote))

    await page.goto(`http://localhost:3000/pdf/quote?quote=${encodedQuote}`, {
        waitUntil: "networkidle2",
    })

    const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
    })

    await browser.close()

    const fileRef = ref(storage, `quotes/${Date.now()}.quote.pdf`)
    await uploadBytes(fileRef, buffer, { contentType: "application/pdf" })
    const url = await getDownloadURL(fileRef)

    return url
})
