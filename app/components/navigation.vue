<template>
    <section class="navigation">
        <div class="blue-bar">
            <content>
                <nuxt-link to="mailto:cody@codywakeford.com">
                    <Icon name="material-symbols:mail-outline-rounded" size="20" />
                    <span>cody@codywakeford.com</span>
                </nuxt-link>
                <nuxt-link to="tel:07570068765">
                    <Icon name="material-symbols:call" size="20" />
                    <span>07570068765</span>
                </nuxt-link>
            </content>
        </div>
        <nav-mobile class="mobile" :class="{ 'background-light': bgWhite === true }" />
        <nav-desktop class="desktop" :class="{ 'background-light': bgWhite === true }" />
    </section>
</template>

<script setup lang="ts">
const bgWhite = ref(false)
onMounted(() => {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) bgWhite.value = true
        else bgWhite.value = false
    })
})
</script>

<style lang="scss" scoped>
.navigation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.background-light {
    background: var(--background) !important;
}

.iconify {
    color: var(--text1);
}

$blue-bar-height: 40px;
$nav-height: 50px;

.mobile {
    display: none;
}

.mobile,
.desktop {
    transition: all 0.3s;
}

.desktop {
    position: absolute;
    top: $blue-bar-height;
    width: 100%;
    display: flex;
    z-index: 50;
}

.blue-bar {
    background: var(--primary);
    min-height: $blue-bar-height;
    display: flex;
    align-items: center;

    .content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 15px;
        width: 100%;
    }

    a {
        display: flex;
        font-size: 1rem;
        flex-direction: row;
        align-items: center;
        color: var(--text1);
        text-decoration: none;
        gap: 5px;
        line-height: 0;
    }

    svg {
        position: relative;
    }
}

@media (max-width: 756px) {
    .mobile {
        display: flex;
    }

    .desktop {
        display: none;
    }
}

@media (max-width: 440px) {
    .content {
        a {
            &:last-child {
                display: none;
            }
        }
    }
}
</style>
