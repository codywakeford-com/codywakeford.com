<template>
    <nav>
        <div class="logo-box">
            <img src="/assets/cw-logo.webp" alt="" />
        </div>

        <cflex class="links">
            <nuxt-link class="nav-item" to="/dashboard/client">
                <Icon icon="material-symbols:construction" width="30" color="white" />
            </nuxt-link>
            <nuxt-link class="nav-item" to="/dashboard/chatroom">
                <!-- <btn> -->
                <Icon icon="material-symbols:android-messages" width="30" color="white" />
                <!-- <tooltip right>Messaging</tooltip> -->
                <!-- </btn> -->
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/documents">
                <Icon icon="ic:baseline-insert-drive-file" width="30" color="white" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/billing">
                <Icon icon="fluent:wallet-credit-card-16-filled" width="30" color="white" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <btn class="nav-item">
                <Icon icon="material-symbols:person" width="30" color="white" />
                <drop right class="profile-menu">
                    <rflex class="menu-item" @click="$User.logout()">
                        <Icon icon="material-symbols:person-2-outline" width="25" color="red" />
                        <span>Logout</span>
                    </rflex>
                </drop>
            </btn>
            <nuxt-link class="nav-item" to="/dashboard/staff">
                <Icon icon="material-symbols:design-services-outline-sharp" width="30" color="white" />
            </nuxt-link>
            <nuxt-link class="nav-item" to="/#hero">
                <Icon icon="material-symbols:arrow-back" width="30" color="white" />
            </nuxt-link>
        </cflex>
    </nav>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
nav {
    min-width: 75px;
    background: $primary;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding-block: 25px;
    z-index: 5;
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: $border-radius;

    &:hover {
        background: $primary-light;
    }
}

.btn {
    border: none;
    padding: 0;
}

.links {
    gap: 25px;
}

.bottom-links {
    gap: 25px;
    margin-top: auto;
}

.logo-box {
    img {
        width: 40px;
    }

    // padding-block: 0px 20px;
    // border-bottom: 1px solid $primary-light;
}

.profile-menu {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 5px;
    border-radius: $border-radius;
    margin-left: 25px;
    box-shadow: 3px 3px 20px lightgrey;

    .rflex {
        gap: 10px;
        padding: 3px 15px;
        $border-radius: 3px;

        &:hover {
            background: $text-light1;
        }
    }
}

.router-link-active {
    background: $primary-light;
}
</style>
