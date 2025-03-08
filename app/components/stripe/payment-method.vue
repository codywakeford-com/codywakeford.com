<template>
    <div class="saved-card visa">
        <div class="top-row">
            <rflex>
                <img src="/assets/cw-logo.webp" alt="logo" />
                <!-- <Icon icon="brandico:amex" v-if="card.brand === 'amex'" width="25" color="lightblue" /> -->
                <!-- <Icon icon="logos:mastercard" v-if="card.brand === 'mastercard'" /> -->
                <!-- <Icon icon="logos:visa" v-if="card.brand === 'visa'" width="50" /> -->
            </rflex>

            <btn class="menu-button">
                <Icon icon="majesticons:dots-horizontal" height="30" />
                <drop bottom class="menu">
                    <button class="menu-item" @click="$User.deletePaymentProfile(card.paymentMethodId)">
                        <Icon icon="solar:trash-bin-trash-bold" width="20" />
                        <span>Delete Card</span>
                    </button>
                </drop>
            </btn>
        </div>

        <div class="card-number">**** **** **** {{ card.last4 }}</div>

        <div class="bottom-row">
            <div class="name-box">
                <label for="">Name</label>
                <div class="name">{{ card.nameOnCard }}</div>
            </div>

            <div class="expiry-box">
                <label for="">Exp. date</label>
                <div class="expiry">{{ card.expiry }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
interface Props {
    card: PaymentProfile
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.saved-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-block: 15px;
    padding-inline: 20px;
    border-radius: 10px;

    width: 300px;
    height: 175px;
    color: var(--text1);

    .top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
            width: 35px;
        }
    }

    .bottom-row {
        display: flex;
        justify-content: space-between;
    }

    .name-box {
        display: flex;
        flex-direction: column;

        label {
            font-size: 0.8rem;
            color: var(--text2);
        }

        .name {
            font-size: 1rem;
        }
    }

    .menu-button {
        padding: 0px;
        border: none;
        border-radius: $border-radius;

        .menu {
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: var(--text1);
            padding: 5px;
            border-radius: $border-radius;
            transform: translateX(0%);
            top: calc(100% + 5px);
            right: 0px !important;
            left: auto !important;

            .menu-item {
                display: flex;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
                background: var(--text1);
                border-radius: 3px;
                padding: 4px 10px;
                font-weight: 500;

                &:hover {
                    background: var(--text2);
                }

                svg {
                    color: red;
                }
            }
        }

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .card-number {
        font-size: 1.3rem;
    }

    .expiry-box {
        display: flex;
        flex-direction: column;

        label {
            font-size: 0.75rem;

            color: var(--text2);
        }
    }

    &.visa {
        // background: var(--primary2);
        background: var(--primary);
    }
}
</style>
