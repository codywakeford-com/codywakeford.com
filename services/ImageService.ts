import imageCompression from "browser-image-compression"

export default class ImageService {
    static async resizeImage(file: File, width: number, height: number) {
        const options = {
            maxWidthOrHeight: Math.min(width, height),
            initialQuality: 0.75,
        }

        const resizedImage = await imageCompression(file, options)

        return resizedImage
    }
}
