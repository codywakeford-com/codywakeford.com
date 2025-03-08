<template>
    <dialog ref="dialog" id="design-modal" @click="dialog?.close()">
        <section>
            <iframe
                style="border: 1px solid rgba(0, 0, 0, 0.1)"
                width="750px"
                height="900px"
                :src="$Projects.designUrl(projectId)"
                allowfullscreen
            ></iframe>
        </section>
    </dialog>
</template>

<script setup lang="ts">
const dialog = ref<HTMLDialogElement | null>(null)
const projectId = useRoute().params.id as string
</script>

<style lang="scss" scoped></style>
