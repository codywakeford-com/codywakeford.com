<template>
    <nav>
        <nuxt-link to="/" class="logo-box">
            <img src="/assets/cw-logo.webp" alt="logo" />
        </nuxt-link>

        <cflex class="links">
            <nuxt-link class="nav-item" to="/dashboard/client" data-tooltip="Projects">
                <Icon name="material-symbols:construction" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/documents" data-tooltip="Files">
                <Icon name="ic:baseline-insert-drive-file" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/dashboard/client/billing" data-tooltip="Billing">
                <Icon name="fluent:wallet-credit-card-16-filled" size="30" />
            </nuxt-link>

            <nuxt-link to="/dashboard/domains" class="nav-item" data-tooltip="Market">
                <Icon name="healthicons:market-stall" size="30" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <nuxt-link @click="AuthController.logout()" class="nav-item" data-tooltip="Logout"> l o </nuxt-link>

            <nuxt-link v-if="true" class="nav-item" to="/dashboard/staff" data-tooltip="staff">
                <Icon name="eos-icons:admin" size="30" />
            </nuxt-link>

            <nuxt-link class="nav-item" to="/#hero" data-tooltip="Back to homepage">
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

.nav-item {
    position: relative;
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: $border-radius;

    &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: 65px;
        background-color: #333;
        color: #fff;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.9rem;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease-in-out;
    }

    &:hover {
        background: $primary-light;

        &::after {
            opacity: 1;
            visibility: visible;
        }
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
