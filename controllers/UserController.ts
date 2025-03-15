import DbService from "~~/services/DbService"
import FilesService from "~~/services/FilesService"
import ImageService from "~~/services/ImageService"

export default class UserController {
    static async updateProfilePic(userId: string, imageFile: File) {
        try {
            const smallImage = await ImageService.resizeImage(imageFile, 75, 75)
            const url = await FilesService.uploadToFirebase(`profile-images/${userId}-${Date.now()}`, smallImage)
            await DbService.updateObject(`/users/${userId}`, { profilePic: url })

            return { error: null }
        } catch (e) {
            console.log(e)
            return { error: "An unknown error has occured" }
        }
    }
}
