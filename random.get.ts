import fs from "fs"
import * as geofire from "geofire-common"
import { join } from "path"
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage"
import imageType from "image-type"
import sharp from "sharp"
import { preview } from "vite"
import { addDoc, collection } from "firebase/firestore"

import { $fetch } from "ofetch" // If you need to explicitly import

async function downloadImageAsBuffer(url: string): Promise<{ buffer: Buffer } | null> {
    const response = await $fetch(url, {
        method: "GET",
        headers: {
            "User-Agent": "CustomUserAgent",
        },
        redirect: "follow",
        responseType: "arrayBuffer",
    })
    console.log(response)
    // const contentType = response.type // We assume this is passed or handled elsewhere in your application
    // if (!contentType?.startsWith("image/")) {
    //     console.log("Response is not an image")
    //     throw new Error("Response is not an image")
    // }

    const buffer = Buffer.from(response)
    // console.log(contentType)

    return { buffer }
}

export async function uploadBufferToFirebase(storage: FirebaseStorage, buffer: Buffer, mimeType: string, preview: boolean = false): Promise<string | null> {
    try {
        let processedBuffer = buffer

        const image = sharp(buffer)
        const fileName = `${Date.now()}`

        const format = mimeType.split("/")[1]
        if (!["jpeg", "png", "webp"].includes(format)) {
            throw new Error(`Unsupported image format: ${mimeType}`)
        }

        if (preview) {
            processedBuffer = await image.resize(300).toFormat(format, { quality: 60 }).toBuffer()
        } else {
            processedBuffer = await image.resize(1440).toFormat(format, { quality: 80 }).toBuffer()
        }

        const storageRef = ref(storage, `uploads/${Date.now()}-${fileName}`)
        const snapshot = await uploadBytes(storageRef, processedBuffer, { contentType: mimeType })
        const downloadURL = await getDownloadURL(snapshot.ref)

        return downloadURL
    } catch (error) {
        console.error("Error uploading buffer:", error)
        return null
    }
}

// Function to detect MIME type from buffer
async function getMimeType(buffer: Buffer) {
    const type = await imageType(buffer)
    if (type) {
        return type.mime // Returns the MIME type (e.g., 'image/jpeg', 'image/png')
    } else {
        throw new Error("Unsupported image format")
    }
}

async function getImages(storage: FirebaseStorage, urls: string[]): Promise<PropertyImage[]> {
    const images: PropertyImage[] = []
    try {
        for (let i = 0; i < urls.length; i++) {
            const response = await downloadImageAsBuffer(urls[i])

            if (!response) continue

            const { buffer } = response
            const extension = "jpg"
            const filename = `image_${uuid()}.${extension}`

            const mime = await getMimeType(buffer)
            console.log(mime)
            const previewUrl = await uploadBufferToFirebase(storage, buffer, mime, true)
            const imageUrl = await uploadBufferToFirebase(storage, buffer, mime)

            if (!previewUrl || !imageUrl) {
                throw new Error("Error uploading to Firebase")
            }

            images.push({
                id: uuid(),
                index: i,
                preview: previewUrl,
                image: imageUrl,
            })
        }

        return images
    } catch (e) {
        console.log(e)

        return []
    }
}

export default defineEventHandler(async (event) => {
    try {
        const jsonPath = join(process.cwd(), "json.json")
        const json = fs.readFileSync(jsonPath, "utf-8")
        const data = JSON.parse(json) as any

        const storage = event.context.storage

        console.log(storage)

        const newData: Property[] = await Promise.all(
            data.slice(0, 1).map(async (p: any) => {
                const surfaceArea = p.surface_area || {}
                const footprint = Number(surfaceArea.built_to || 0) + Number(surfaceArea.terrace_to || 0)

                const images: string[] = (p.images?.image || []).map((i: any) => {
                    return decodeURIComponent(i.url).replace(/&amp;/g, "&")
                })

                const propertyImages = await getImages(storage, images)

                return {
                    name: p.development_name || "Unknown",
                    type: "any",
                    bedroomsFrom: Number(p.beds || 0),
                    bedroomsTo: Number(p.beds_to || p.beds || 0),
                    bathrooms: Number(p.baths || 0),
                    timestamp: Date.now(),
                    id: uuid(),
                    price: Number(p.price || 0),
                    footprintFrom: footprint,
                    footprintTo: footprint,
                    buildYear: Number(p.startDate) || 2025,
                    description: p.description?.uk || "No description available.",
                    address: {
                        city: p.province || "Unknown",
                        street: p.area || "Unknown",
                        postcode: p.town || "Unknown",
                        number: 0,
                    },
                    lat: Number(p.latitude || 0),
                    lng: Number(p.longitude || 0),
                    geohash: geofire.geohashForLocation([Number(p.latitude || 0), Number(p.longitude || 0)]),
                    images: propertyImages,
                }
            })
        )

        const db = event.context.db
        newData.forEach(async (dataItem) => {
            const docRef = await addDoc(collection(db, "properties"), {
                ...dataItem,
            })
        })

        return newData
    } catch (e) {
        console.log(e)
        return e
    }
})
