<template>
    <nav class="profile-nav">
        <header>
            <div class="flex">
                <div @click="onProfilePicClick()">
                    <img class="profile-pic" v-if="imagePreview" :src="imagePreview" alt="" />
                    <img
                        class="profile-pic"
                        v-else-if="$User.state.user.profilePic"
                        :src="$User.state.user.profilePic"
                        alt=""
                    />
                    <div v-else class="profile-pic">CW</div>
                </div>

                <div class="right">
                    <h3>{{ $User.user.firstName }} {{ $User.user.lastName }}</h3>
                    <h4>{{ $User.user.email }}</h4>
                </div>
            </div>

            <input type="file" accept="image/*" hidden ref="imageInputRef" @change="handleInput" />
            <button-primary-m v-if="imagePreview" @click="saveProfilePic">Save Profile</button-primary-m>
        </header>

        <div class="links">
            <nuxt-link to="/dashboard/profile">
                <Icon name="mdi:account-details" size="30" />
                <span>Personal Information</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
            <nuxt-link to="/dashboard/profile/billing">
                <Icon name="fluent:wallet-credit-card-16-filled" size="30" />
                <span>Billing Details</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
        </div>

        <div class="links bottom">
            <nuxt-link @click="AuthController.logout()">
                <Icon name="bx:log-out" size="30" />
                <span>Log out</span>
                <Icon class="float-right" name="material-symbols:arrow-right-rounded" size="25" />
            </nuxt-link>
        </div>
    </nav>
</template>

<script setup lang="ts">
import AuthController from "~~/controllers/AuthController"
import UserController from "~~/controllers/UserController"
const $User = useUserStore()

const imageInputRef = ref<HTMLInputElement | null>(null)
const imageFile = ref<any | null>(null)
const imagePreview = ref<string | null>(null)

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | null
    if (!target || !target.files || target.files.length === 0) return

    const file = target.files[0]

    imageFile.value = file

    if (!file) return
    imagePreview.value = URL.createObjectURL(file)
}

function onProfilePicClick() {
    if (!imageInputRef.value) return
    imageInputRef.value.click()
}

async function saveProfilePic() {
    const { error } = await UserController.updateProfilePic($User.state.user.id, imageFile.value)

    if (!error) {
        imageFile.value = null
        imagePreview.value = null
    }
}
</script>

<style scoped lang="scss">
@use "~/style/profile.scss";
</style>
