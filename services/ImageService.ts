import imageCompression from "browser-image-compression"

export default class ImageService {
    static async resizeImage(file: File, width: number, height: number) {
        if (!file.type.startsWith("image")) {
            throw new Error("Only images can be resized")
        }

        const options = {
            maxWidthOrHeight: Math.min(width, height),
            initialQuality: 0.75,
        }

        const resizedImage = await imageCompression(file, options)

        return resizedImage
    }

    static async compress(file: File, compression: number) {
        if (!file.type.startsWith("image")) {
            throw new Error("Only images can be compressed")
        }

        const options = {
            initialQuality: compression,
        }

        const image = await imageCompression(file, options)

        return image
    }
}
