<template>
    <section class="search-section">
        <div class="input-box">
            <Icon name="mdi-light:magnify" size="25" />
            <input type="search" placeholder="Search files..." v-model="$FilesDashboard.state.filters.search" />
        </div>

        <select name="" id="" v-model="$FilesDashboard.state.filters.type">
            <option value="any">Any</option>
            <option value="image">Image</option>
            <option value="document">Document</option>
        </select>

        <button-primary-m @click="openModal('files-modal')">Upload File</button-primary-m>
    </section>
</template>

<script setup lang="ts">
const $FilesDashboard = useFilesDashboardStore()
</script>

<style scoped lang="scss">
.input-box {
    display: flex;
    align-items: center;
    background: var(--text1-1);
    padding: 5px 10px;
    border-radius: 5px;

    input {
        min-width: 300px;
        background: none;
        border: none;

        &:focus {
            outline: none;
        }
    }
}
</style>
