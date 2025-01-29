<template>
    <div class="file" @click="pdfModal?.showModal()" :class="{document: file.type === 'document'}">
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
        <div class="top" >
            <embed   embed v-if="file.type === 'document'" :src="file.url" width="150px" height="100px"></embed>
                <!-- <Icon icon="circum:file-on" width="75" class="document-icon" /> -->
                <img  v-else :src="file.previewUrl ? file.previewUrl : file.url" />
        </div>
            
        <div class="bottom" v-if="file.type === 'document'">
            <div class="name" >{{ truncatedName }}</div>
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
    max-width: 175px;
    background: $text-light1;
    border: 1px solid $text-light2;
    cursor: pointer;

    &.document {
        padding: 10px 5px;

        .top {

            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            
            max-height: 100px;
            position: relative;
            padding-block: 5px;

            &::after {
                    content: "";
                    height: 100%;
                    width: 100%;
                    z-index: 10;;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

            embed {
                position: relative;
                object-fit: cover;

                scrollbar-width: 0px;
                border: none;
            }
            
                    .document-icon {
                        padding-top: 5px;
                    }
        }
    }

    &.image {
        
        padding-block: 0;
    }
    

    .bottom {
        padding-inline: 15px;
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
}
</style>
