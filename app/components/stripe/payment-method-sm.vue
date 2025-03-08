<template>
    <section>
        <div class="saved-card" :class="{ selected: props.selected }">
            <div class="left">
                <div class="top">
                    <Icon icon="brandico:amex" v-if="card.brand === 'amex'" width="25" color="lightblue" />
                    <Icon icon="logos:mastercard" v-if="card.brand === 'mastercard'" />
                    <Icon icon="logos:visa" v-if="card.brand === 'visa'" width="50" />
                    <div class="card-number">**** **** **** {{ card.last4 }}</div>
                </div>

                <div class="bottom">
                    <div class="name-box">
                        <!-- <label for="">Name</label> -->
                        <div class="name">{{ card.nameOnCard }}</div>
                    </div>

                    <div class="expiry-box">
                        <!-- <label for="">Exp. date</label> -->
                        <div class="expiry">{{ card.expiry }}</div>
                    </div>
                </div>
            </div>

            <div class="right">
                <div class="radio"></div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

interface Props {
    card: PaymentProfile
    selected: boolean
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.saved-card {
    cursor: pointer;
    transition: none;
    display: flex;
    justify-content: space-between;
    gap: 30px;
    min-width: 300px;

    border: 1px solid var(--text6);
    border-radius: $border-radius;
    padding: 20px;

    .left {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .top,
        .bottom {
            font-size: 0.9rem;
            display: flex;
            gap: 25px;
        }
    }

    .right {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 30px;

        .radio {
            position: relative;
            background: var(--secondary);
            height: 15px;
            width: 15px;
            border-radius: 50%;
        }
    }

    &.selected {
        outline: 2px solid var(--primary);

        .radio {
            transition: none;
            outline: 2px solid var(--primary);
            &::after {
                display: block;
                content: "";
                height: 10px;
                width: 10px;
                background: var(--primary);
                border-radius: 50%;
                transform: translate(25%, 25%);
                z-index: 5;
            }
        }
    }

    label {
        font-size: 0.6rem;
        font-weight: 600;
    }
}
</style>
