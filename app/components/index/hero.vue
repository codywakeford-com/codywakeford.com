<template>
    <section id="hero">
        <div class="pattern-background" />
        <content>
            <div class="hero-text">
                <h1>High Quality Websites for Small Businesses</h1>
                <h2>
                    I make superb, budget-friendly websites for small to medium-sized businesses that want effective,
                    user-friendly, and beautiful websites
                    their customers will love.
                </h2>
            </div>
            <img class="hero-image" src="/assets/hero-image.png" alt="cody wakeford" />
        </content>
    </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
section {
    position: relative;
    width: 100%;
    height: 100%;
    margin-inline: auto;
    margin-top: 40px;
    height: 600px;
}

.hero-text {
    display: flex;
    flex-direction: column;
    margin-top: 200px;
    gap: 15px;
    width: 650px;
    margin-block: auto;

    h1 {
        font-size: 3.5rem;
        font-weight: 400;
        letter-spacing: 1px;
        font-weight: 600;
    }

    h2 {
        font-weight: normal;
        font-size: 1.2rem;
        color: var(--text5);
        max-width: 500px;
        line-height: 1.6;
    }
}

.content {
    display: flex;
    align-items: center;
}

.hero-image {
    position: absolute;
    bottom: 0px;
    right: var(--page-gutter);

    width: 225px;
}

@media (max-width: 950px) {
    .hero-text {
        max-width: 100%;

        h1 {
            /* Clamp: min 2rem, preferred 5vw, max 3rem */
            font-size: clamp(2.2rem, 5vw, 3rem);
        }

        h2 {
            /* Clamp: min 1rem, preferred 3vw, max 1.1rem */
            font-size: clamp(1rem, 2.5vw, 1.3rem);
            max-width: 75%;
        }
    }
}

@media (max-width: 880px) {
    .hero-text {
        margin-block: 150px auto;

        h1 {
            max-width: 100% !important;
        }
    }

    .hero-image {
        width: 20%;
    }
}

@media (max-width: 390px) {
    .hero-text {
        margin-block: 100px auto;
    }
}
</style>
