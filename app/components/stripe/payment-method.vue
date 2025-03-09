<template>
    <div class="saved-card visa">
        <div class="top-row">
            <rflex>
                <img src="/assets/cw-logo.webp" alt="logo" />
                <!-- <Icon icon="brandico:amex" v-if="card.brand === 'amex'" width="25" color="lightblue" /> -->
                <!-- <Icon icon="logos:mastercard" v-if="card.brand === 'mastercard'" /> -->
                <!-- <Icon icon="logos:visa" v-if="card.brand === 'visa'" width="50" /> -->
            </rflex>

            <button class="menu-button">
                <Icon name="majesticons:dots-horizontal" size="30" />
                <drop bottom class="menu">
                    <button class="menu-item" @click="PaymentController.removePaymentMethod(card.paymentMethodId)">
                        <Icon name="solar:trash-bin-trash-bold" size="20" />
                        <span>Delete Card</span>
                    </button>
                </drop>
            </button>
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
import type PaymentController from "~~/controllers/PaymentController"

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
    color: var(--text1a);

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
            color: var(--text1a);
        }

        .name {
            font-size: 1rem;
            color: var(--text1a);
        }
    }

    .menu-button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
        width: 35px;
        border: none;
        background: var(--primary);
        border-radius: $border-radius;

        .iconify {
            color: var(--text1a);
        }

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
                background: var(--text1a);
                border-radius: 3px;
                padding: 4px 10px;
                font-weight: 500;

                &:hover {
                    background: var(--primary-light);
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
        color: var(--text1a);
    }

    .expiry-box {
        display: flex;
        flex-direction: column;

        .expiry {
            color: var(--text1a);
        }

        label {
            font-size: 0.75rem;
            color: var(--text1a);
        }
    }

    &.visa {
        // background: var(--primary2);
        background: var(--primary);
    }
}
</style>
