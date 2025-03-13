<template>
    <dialog @click="$EmbedModal.close()" id="embed-modal">
        <section>
            <img
                v-if="$EmbedModal.state.embedMime.startsWith('image')"
                :src="$EmbedModal.state.embedUrl"
                alt="Image preview"
            />
            <embed v-else :src="$EmbedModal.state.embedUrl" :type="$EmbedModal.state.embedMime" />
        </section>
    </dialog>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
section {
    height: 80vh;
    min-width: 60vh;
}
embed {
    height: 100%;
    width: 100%;
}
</style>
