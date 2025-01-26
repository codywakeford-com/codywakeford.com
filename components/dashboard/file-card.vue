<template>
    <div class="file" @click="pdfModal?.showModal()">
        <!-- <div class="controls" v-if="props.delete || props.download">
            <Icon
                @click="emits('delete')"
                v-if="props.delete"
                icon="solar:trash-bin-trash-bold"
                color="red"
                width="15"
            />
            <Icon
                v-if="download"
                icon="ic:round-file-download"
                @click="downloadFile(file.url)"
                width="14"
            />
        </div> -->
        <div class="top">
            <Icon icon="circum:file-on" width="75" class="document-icon" v-if="file.type === 'document'" />
            <img :src="file.previewUrl ? file.previewUrl : file.url" v-else />
        </div>

        <div class="bottom">
            <div class="name" v-if="file.type === 'document'">{{ truncatedName }}</div>
        </div>
    </div>
    <!-- 
    <modal id="imageModal">
        <img :src="file.url" alt="" />
    </modal> -->

    <dialog @click="pdfModal?.close()" ref="pdfModal" v-if="file.type === 'document'">
        <embed :src="file.url" type="application/pdf" width="899px" height="1200px" />
    </dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
const pdfModal = ref<HTMLDialogElement | null>(null)

const props = defineProps<{
    file: ProjectFile
    delete: boolean
    download: boolean
}>()

const truncatedName = computed(() => {
    if (props.file.name.length < 13) return props.file.name
    return `${props.file.name.slice(0, 13)}...`
})

const emits = defineEmits(["delete"])
</script>

<style lang="scss" scoped>
.file {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    gap: 5px;
    border-radius: $border-radius;

    height: min-content;
    min-width: 175px;
    height: 175px;
    max-width: 175px;
    background: $text-light1;
    border: 1px solid $text-light2;
    // box-shadow: 1px 1px 10px $text-light2;

    .top {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;

        .document-icon {
            padding-top: 5px;
        }
    }

    .bottom {
        padding: 15px;
        text-align: left;

        .name {
            font-weight: 500;
            font-size: 0.9rem;
            white-space: nowrap;
        }
    }

    .controls {
        position: absolute;
        display: flex;

        top: -10px;
        gap: 5px;
        right: -5px;
        padding: 5px 10px;
        background: $primary;
        border-radius: $border-radius;
        color: $text-light1;
    }

    img {
        max-width: 100%;
        border-radius: $border-radius;
        max-height: 100%;
    }
}

dialog {
    border: none;
    padding: 0;

    &::backdrop {
    }
}
</style>
