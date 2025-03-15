<template>
    <div ref="nav" :class="{ 'nav-active': navActive }" class="nav-box">
        <nav>
            <div class="left">
                <img src="/assets/cw-logo.webp" alt="logo" />
            </div>

            <div class="right">
                <button @click.stop="navActive = false">
                    <Icon v-if="navActive" name="akar-icons:cross" size="25" />
                </button>

                <button @click.stop="navActive = true">
                    <Icon v-if="!navActive" size="30" name="solar:hamburger-menu-linear" />
                </button>
            </div>
        </nav>

        <aside>
            <nav-item-list @click="navActive = false" />
        </aside>
    </div>
</template>

<script setup lang="ts">
const navActive = ref(false)
const nav = ref<HTMLDivElement | null>(null)

onMounted(() => {
    window.addEventListener("click", (event: Event) => {
        if (navActive.value === false) return
        if (!nav.value?.contains(event.target as Node)) {
            navActive.value = false
        }
    })
})
</script>

<style lang="scss" scoped>
.nav-box {
    position: relative;
    width: 100%;

    &.nav-active {
        aside {
            top: 100%;
        }

        nav {
            border-bottom: 0;
        }
    }
}

nav {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--background);
    border-bottom: 3px solid var(--primary);
    padding-block: 10px;
    padding-inline: 25px;
    z-index: 100;
}

.left {
    img {
        width: 45px;
        filter: invert(1);
    }
}

aside {
    position: absolute;
    width: 100vw;
    left: 0;
    top: -365%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: -1;
    background: var(--background);
    border-bottom: 3px solid var(--primary);

    padding-inline: 25px;
    padding-block: 10px 25px;
}

button {
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
