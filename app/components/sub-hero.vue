<template>
    <div class="container">
        <div class="pattern-background" />
        <content>
            <section>
                <header>
                    <h1><slot /></h1>
                </header>

                <img src="/assets/hero-image.png" alt="hero-image" />
            </section>
        </content>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.container {
    width: 100%;
    border-bottom: 5px solid var(--primary);
    position: relative;
    z-index: 5;
    margin-top: 75px;
}

.content {
    height: 100%;
}

section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

h1 {
    font-size: 2.5rem;
}

img {
    max-width: 100px;
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -o-sticky;
    position: -ms-sticky;
    position: absolute;
    right: 50px;
    bottom: 0;
}
</style>
