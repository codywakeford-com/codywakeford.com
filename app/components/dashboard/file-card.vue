<template>
    <div class="file-card">
        <div class="top">
            <div>
                <Icon name="ri:file-2-line" size="30px" />
                <div class="name">{{ file.name }}</div>
            </div>

            <button @click="menuActive = !menuActive">
                <Icon name="mage:dots-horizontal" size="25" />
            </button>
        </div>
        <div class="bottom">
            <div>{{ dayjs(file.timestamp).format("DD MMM") }}</div>
            <div>{{ (file.size / 1024 / 102).toFixed(2) }} kb</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const menuActive = ref(false)
const props = defineProps<{
    file: ProjectFile
}>()
</script>

<style lang="scss" scoped>
@use "@/style/file-card.scss" as *;

.file-card {
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

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            background: none;
            border-radius: 5px;
            height: 30px;
            width: 30px;
            transform: translate(5px, -5px);

            &:hover {
                background: $text-light1;
            }
        }
    }

    .bottom {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        color: $text-dark3;
    }
}
</style>
