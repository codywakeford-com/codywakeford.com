<template>
    <div class="file-card">
        <div class="top">
            <div>
                <Icon name="ri:file-2-line" size="30px" />
                <div class="name">{{ file.name }}</div>
            </div>

            <button ref="menuOpenButton" class="menu-button" @click="toggleMenu()">
                <Icon name="mage:dots-horizontal" size="25" />
            </button>
        </div>
        <div class="bottom">
            <div>{{ dayjs(file.timestamp).format("DD MMM") }}</div>
            <div>{{ (file.size / 1024 / 102).toFixed(2) }} kb</div>
        </div>

        <div class="menu" ref="menu" v-show="menuActive">
            <a :href="file.url" :download="file.name">
                <button>
                    <Icon name="material-symbols:download" size="20" />
                    <span>Download</span>
                </button>
            </a>

            <button>
                <Icon name="streamline:interface-edit-view-eye-eyeball-open-view" size="20" />
                <span>View</span>
            </button>

            <nuxt-link :to="file.url" target="_blank">
                <button>
                    <Icon name="streamline:interface-edit-view-eye-eyeball-open-view" size="20" />
                    <span>View Fullscreen</span>
                </button>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const menu = ref<HTMLElement | null>(null)
const menuOpenButton = ref<HTMLButtonElement | null>(null)

const menuActive = ref(false)

function toggleMenu() {
    menuActive.value = true
}

const handleClickOutside = (event: MouseEvent) => {
    if (!menu.value) return
    if (!menuOpenButton.value) return

    if (menu.value.contains(event.target as Node) || menuOpenButton.value.contains(event.target as Node)) return
    menuActive.value = false
}

onMounted(() => {
    window.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside)
})

const props = defineProps<{
    file: ProjectFile
}>()
</script>

<style lang="scss" scoped>
@use "@/style/file-card.scss" as *;

.file-card {
    position: relative;
    flex-direction: column;

    .top {
        display: flex;

        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        font-weight: bold;
        min-width: 250px;
        margin-bottom: 5px;

        div {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .menu-button {
            display: flex;
            justify-content: center;
            align-items: center;
            background: none;
            border-radius: 5px;
            height: 30px;
            width: 30px;
            transform: translate(5px, -5px);

            &:hover {
                background: var(--text1);
            }
        }
    }

    .bottom {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        color: var(--text6);
    }
}
.menu-button {
    position: relative;
}
.menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: 175px;
    gap: 3px;
    top: 25px;
    right: 50px;
    transform: translateX(-0%);
    background: var(--background);
    padding: 15px 0;
    border-radius: 5px;
    border: 1px solid var(--text2);
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.1);
    z-index: 15;

    button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding-inline: 15px;
        background: none;
        padding-block: 6px;
        &:hover {
            background: var(--text1);
        }
    }

    .iconify {
        color: var(--primary);
    }
}
</style>
