<template>
    <div class="file-card">
        <div class="top">
            <div>
                <Icon name="material-symbols-light:folder" size="30px" />
                <div class="name">{{ project.id }}</div>
            </div>
        </div>

        <div class="bottom">
            <!-- <div>{{ dayjs(file.timestamp).format("DD MMM") }}</div> -->
            <!-- <div>{{ (file.size / 1024 / 102).toFixed(2) }} kb</div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
const menuActive = ref(false)
const props = defineProps<{
    project: Project
}>()
</script>

<style lang="scss" scoped>
.file-card {
    padding: 20px;
    border-radius: 5px;
    border: 1px solid $text-light2;
    background: white;

    .top {
        display: flex;

        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
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
