<template>
    <section id="why">
        <div class="pattern-background" />
        <content>
            <section-sub-header color="dark">
                <template #sub>QUALITY AND AFFORDABLE</template>
                <template #header>Websites Built for Success</template>
            </section-sub-header>

            <div class="cards">
                <div class="card">
                    <Icon icon="mingcute:happy-line" width="50" />
                    <h3>User Experience Focused</h3>
                    <p>
                        By focusing on the needs and behaviors of your users, I create websites that not only look great
                        but also
                        drive engagement and
                        conversions.
                    </p>
                </div>

                <div class="card">
                    <Icon icon="fluent:cursor-click-20-regular" width="50" />
                    <h3>Conversion Optimised</h3>
                    <p>
                        I know the little tricks that can push people to convert from a visitor to a customer. I help
                        make your site
                        pay for itself by
                        optimizing the little details.
                    </p>
                </div>

                <div class="card">
                    <Icon icon="material-symbols:mobile-friendly" width="40" />
                    <h3>Mobile Optimised</h3>
                    <p>52% of people are viewing websites on a phone. So it's imperative that websites are pixel perfect
                        for all
                        screen sizes.</p>
                </div>

                <div class="card">
                    <Icon icon="material-symbols:screen-search-desktop-outline" width="50" />
                    <h3>Search Engine Optimised</h3>
                    <p>
                        Your site will follow the best SEO practices to begin its ranking including meta data, proper
                        markup,
                        sitemaps, image names,
                        accessibility, and more!
                    </p>
                </div>

                <div class="card">
                    <Icon icon="streamline:interface-layout-2-column-header-layout-layouts-masthead-sidebar"
                        width="40" />
                    <h3>Beautifully Designed</h3>
                    <p>
                        Your website won’t be from a cookie-cutter layout. It will be designed to beautifully fit the
                        style of your
                        brand from fonts, icons,
                        colors, and more!
                    </p>
                </div>

                <div class="card">
                    <Icon icon="material-symbols:speed-outline" width="50" />
                    <h3>Speed Optimised</h3>
                    <p>
                        Your site will be developed with speed optimisation in mind and performance in mind. No site
                        should be slow
                        for its users losing out on
                        customers.
                    </p>
                </div>

                <div class="card">
                    <Icon icon="emojione-monotone:nerd-face" width="50" />
                    <h3>One-Stop-Shop Support</h3>
                    <p>
                        It won’t be just a website, I'll be one email away for any website support you need. I often
                        help out for
                        free if it's a quick change,
                        or for a compatible cheap rate.
                    </p>
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
    position: relative;
}

.content {
    padding-block: var(--page-gutter) calc(var(--page-gutter) * 2);
    color: var(--text4);
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.cards {
    display: flex;
    gap: 50px;
    flex-wrap: wrap;
    justify-content: center;

    .card {
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 5px;

        max-width: 300px;

        svg {
            color: var(--primary);
            margin-bottom: 10px;
        }

        h3 {
            color: var(--primary);
        }

        p {
            color: var(--text5);
        }
    }
}
</style>
