import puppeteer from "puppeteer"
import path from "path"
import { fileURLToPath } from "url"
import { ref, getStorage, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default eventHandler(async (event) => {
    console.log(await readBody(event))
    const storage = event.context.storage as FirebaseStorage
    const data = await readBody(event)
    const { type } = event.context.params || {}

    const browser = await puppeteer.launch({
        headless: true,
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 1240, height: 1754 })
    const encodedData = encodeURIComponent(JSON.stringify(data))

    try {
        await page.goto(`http://localhost:3000/pdf/${type}?data=${encodedData}`, {
            waitUntil: "networkidle2",
        })

        const filePath = path.resolve(`./${type}.pdf`)
        const buffer = await page.pdf({
            format: "A4",
            printBackground: true,
        })

        await browser.close()

        const fileRef = ref(storage, `${type}/${Date.now()}.${type}.pdf`)
        await uploadBytes(fileRef, buffer, { contentType: "application/pdf" })
        const url = await getDownloadURL(fileRef)

        return url
    } catch (e) {
        console.log(e)
    }
})
