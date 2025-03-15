import { getDownloadURL, uploadBytes, ref as storageRef, type UploadMetadata, FirebaseStorage } from "firebase/storage"
import puppeteer from "puppeteer"
import { uuid } from "~/utils/uuid"

export namespace ApiPdfIndex {
    export interface RequestBody {
        data: any
        projectId: string
        fileName: string
    }

    export type Response = Promise<ProjectFile>
}

export default eventHandler(async (event): ApiPdfIndex.Response => {
    const { data, projectId, fileName } = await readBody(event)
    const storage = event.context.storage as FirebaseStorage
    const { type } = event.context.params || {}

    try {
        console.log(data, projectId, fileName)

        const browser = await puppeteer.launch({
            headless: true,
        })

        const page = await browser.newPage()

        await page.setViewport({ width: 1240, height: 1754 })
        const encodedData = encodeURIComponent(JSON.stringify(data))

        await page.goto(`http://localhost:3000/pdf/${type}?data=${encodedData}`, {
            waitUntil: "networkidle2",
        })

        const buffer = await page.pdf({
            format: "A4",
            printBackground: true,
        })

        const previewfileStorageRef = storageRef(storage, `/projects/${projectId}-${Date.now()}/files/${fileName}`)
        const downloadFileStorageRef = storageRef(
            storage,
            `/projects/${projectId}-${Date.now()}/download-files/${fileName}`,
        )
        await uploadBytes(previewfileStorageRef, buffer, { contentType: "application/pdf" })
        await uploadBytes(downloadFileStorageRef, buffer, { contentType: "octet/stream" })

        const previewUrl = await getDownloadURL(previewfileStorageRef)
        const downloadUrl = await getDownloadURL(downloadFileStorageRef)

        const projectFile: ProjectFile = {
            id: uuid(),
            size: 150000,
            sender: "codywakeford@gmail.com",
            mime: "application/pdf",
            timestamp: Date.now(),
            lastModified: Date.now(),
            previewUrl,
            downloadUrl,
            smallImageUrl: undefined,
            projectId,
            name: fileName,
        }

        console.log(projectFile)

        browser.close()

        return projectFile
    } catch (e) {
        console.log(e)
        throw createError({
            statusCode: 500,
        })
    }
})
