<template>
    <section id="services">
        <content>
            <section-sub-header color="light">
                <template #sub>UNBEATABLE VALUE</template>
                <template #header>Web Development Services</template>
            </section-sub-header>

            <div class="cards">
                <div class="card">
                    <Icon icon="hugeicons:computer-programming-01" width="50" />
                    <h4>Website Update</h4>
                    <p>Anything from Website Updates, Bug Fixes, Content changes, or additions of any kind.</p>
                </div>

                <div class="card">
                    <Icon icon="hugeicons:computer-programming-02" width="50" />
                    <h4>Website Redesign and Rebuild</h4>
                    <p>Redesigning and building dynamic, user-friendly websites that enhance your online presence and
                        drive
                        engagement.</p>
                </div>

                <div class="card">
                    <Icon icon="hugeicons:computer-settings" width="50" />
                    <h4>Speed Optimization</h4>
                    <p>I can optimise your website for speed, making sure your visitors aren't waiting around.</p>
                </div>
            </div>
        </content>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
</script>

<style lang="scss" scoped>
section {
    background: var(--primary);
    padding-block: var(--page-gutter) calc(var(--page-gutter) * 2);
}

.content {
    display: flex;
    gap: 50px;
    flex-direction: column;
}

.cards {
    display: flex;
    color: var(--text1);
    gap: 50px;
    justify-content: center;
    flex-wrap: wrap;

    .card {
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 5px;
        flex: 1 300px 250px;
        margin-top: 10px;
        max-width: 300px;

        h4 {
            margin-block: 5px 10px;
        }

        p {
            color: var(--text2);
        }

        svg {
            margin-inline: auto;
        }
    }
}
</style>
