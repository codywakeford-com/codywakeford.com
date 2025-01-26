<template>
    <nav class="client-nav">
        <mpage class="admin-mpage">
            <anchor :to="`/admin/projects/${projectId}`">Project Details</anchor>

            <anchor :to="`/admin/projects/${projectId}/chatroom`">Chatroom</anchor>

            <anchor :to="`/admin/projects/${projectId}/design`">Design</anchor>

            <anchor :to="`/admin/projects/${projectId}/billing`">Billing</anchor>

            <anchor :to="`/admin/projects/${projectId}/documents`">Documents</anchor>
        </mpage>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.id as string
</script>

<style lang="sass" scoped>
.client-nav
    width: 100%
    background: white
    box-shadow: 0px 2px 3px #999


    .mpage
        display: flex
        align-items: center
        height: 50px
        padding-inline: 50px
        gap: 50px
    .anchor
        &.active
            color: blue
</style>
