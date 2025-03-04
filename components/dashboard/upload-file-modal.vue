<template>
    <modal id="upload-file-modal">
        <div class="content">
            <h3>Upload file</h3>
        </div>
    </modal>
</template>

<script lang="ts">
onMounted(() => {
    openModal("upload-file-modal");
});
</script>
