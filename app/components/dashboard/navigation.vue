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

            <nuxt-link to="/dashboard/domains" class="nav-item" data-tooltip="Market">
                <Icon name="healthicons:market-stall" size="30" />
            </nuxt-link>

            <nuxt-link to="/dashboard/ads" class="nav-item" data-tooltip="Market">
                <Icon name="mdi:advertisements" size="30" />
            </nuxt-link>
        </cflex>

        <cflex class="bottom-links">
            <nuxt-link v-if="true" class="nav-item" to="/dashboard/profile" data-tooltip="profile">
                <Icon name="material-symbols:account-circle" size="30" />
            </nuxt-link>

            <nuxt-link v-if="true" class="nav-item" to="/dashboard/staff" data-tooltip="staff">
                <Icon name="eos-icons:admin" size="30" />
            </nuxt-link>

            <!-- <button class="nav-item" @click="toggleTheme()"> -->
            <!--     <Icon -->
            <!--         v-if="$colorMode.preference === 'light'" -->
            <!--         name="line-md:moon-filled-to-sunny-filled-loop-transition" -->
            <!--         size="30" -->
            <!--     /> -->
            <!--     <Icon v-else name="line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition" size="30" /> -->
            <!-- </button> -->

            <nuxt-link class="nav-item" to="/#hero" data-tooltip="Back to homepage">
                <Icon name="material-symbols:arrow-back" size="30" />
            </nuxt-link>
        </cflex>
    </nav>
</template>

<script setup lang="ts">
const toggleTheme = () => {
    const colorMode = useColorMode()
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark"
}
</script>

<style lang="scss" scoped>
nav {
    min-width: 75px;
    background: var(--primary);
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
    color: var(--text1);
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: $border-radius;
    background: none;

    .iconify {
        color: var(--text1a);
    }

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
        background: var(--primary2);

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
    // border-bottom: 1px solid var(--primary2);
}

.profile-menu {
    display: flex;
    flex-direction: column;
    background: var(--background);
    padding: 5px;
    border-radius: $border-radius;
    margin-left: 25px;
    box-shadow: 3px 3px 20px lightgrey;

    .rflex {
        gap: 10px;
        padding: 3px 15px;
        $border-radius: 3px;

        &:hover {
            background: var(--text1);
        }
    }
}

.router-link-active {
    background: var(--primary2);
}
</style>
