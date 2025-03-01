<template>
    <nav>
        <nuxt-link to="/" class="logo-box">
            <img src="/assets/cw-logo.webp" alt="logo" />
        </nuxt-link>

        <cflex class="links">
            <nuxt-link class="nav-item" to="/dashboard/client">
                <Icon name="material-symbols:construction" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/documents">
                <Icon name="ic:baseline-insert-drive-file" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/billing">
                <Icon name="fluent:wallet-credit-card-16-filled" size="30" />
            </nuxt-link>

            <nuxt-link to="/dashboard/domains" class="nav-item">
                <Icon name="healthnames:market-stall" size="30" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <!-- <nuxt-l class="nav-item"> -->
            <!--     <Icon name="material-symbols:person" size="30" color="white" /> -->
            <!--     <drop right class="profile-menu"> -->
            <!--         <rflex class="menu-item" @click="$User.logout()"> -->
            <!--             <Icon name="material-symbols:person-2-outline" size="25" color="red" /> -->
            <!--             <span>Logout</span> -->
            <!--         </rflex> -->
            <!--     </drop> -->
            <!-- </btn> -->

            <nuxt-link @click="$User.logout()" class="nav-item"> l o </nuxt-link>

            <nuxt-link v-if="$User.isStaff" class="nav-item" to="/dashboard/staff/pdf">
                <Icon name="ci:file-pdf" size="30" />
            </nuxt-link>

            <nuxt-link v-if="$User.isStaff" class="nav-item" to="/dashboard/staff">
                <Icon name="material-symbols:design-services-outline-sharp" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/#hero">
                <Icon name="material-symbols:arrow-back" size="30" />
            </nuxt-link>
        </cflex>
    </nav>
</template>

<script setup lang="ts"></script>

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

a {
    color: white;
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
