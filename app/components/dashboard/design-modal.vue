<template>
    <dialog ref="dialog" v-if="link" id="design-modal" @click="dialog?.close()">
        <section>
            <iframe
                style="border: 1px solid rgba(0, 0, 0, 0.1)"
                width="750px"
                height="900px"
                :src="link"
                allowfullscreen
            ></iframe>
        </section>
        {{ link }}
    </dialog>
</template>

<script setup lang="ts">
const dialog = ref<HTMLDialogElement | null>(null)
const projectId = useRoute().params.id as string
const $Projects = useProjectStore()

const link = computed(() => {
    let url = $Projects.designUrl(projectId)

    if (!url) return

    url = url.split("node-id=")[0] as string
    url = url.replace("www", "embed")
    url = `${url}0-1&embed-host=share`

    return url
})
</script>

<style lang="scss" scoped></style>
