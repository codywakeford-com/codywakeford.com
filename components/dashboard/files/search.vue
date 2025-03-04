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

        <button-primary-m>Upload File</button-primary-m>
    </section>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss"></style>
