<template>
    <main class="auth-page">
        <form @submit.prevent="handleEmailSignUp" class="auth-form">
            <lheader>
                <h1>Confirm email address</h1>
            </lheader>

            <rflex class="green-box">
                <Icon icon="icon-park-outline:inbox-success" width="50" />
                <p>
                    A confirmation email was sent to
                    <strong>{{ verifyEmail }}</strong>
                </p>
            </rflex>

            <p>Before proceeding, we must verify the authenticity of your inbox.</p>
            <p>
                Check the mailbox! After receiving the email, click on the link provided to confirm
                the email address.
            </p>

            <p class="no-account-p">
                Back to <nuxt-link to="/auth/login">Sign In</nuxt-link> page.
            </p>
        </form>
    </main>
</template>

<script setup>
import { Icon } from "@iconify/vue"
definePageMeta({
    layout: "auth",
    middleware: "dashboard",
})
const verifyEmail = ref("")

onMounted(() => {
    verifyEmail.value = localStorage.getItem("verifyEmail")
})
</script>

<style lang="scss" scoped>
form {
    .lheader {
        margin-bottom: 20px;

        h1 {
            font-size: 1.25rem;
        }
    }

    a {
        text-decoration: underline;
        color: var(--text4);
    }

    p {
        font-size: 0.95rem;
        margin-bottom: 25px;
        color: var(--text4);
    }
}

.green-box {
    background: #b8e494;
    padding: 10px 20px;
    border-radius: 2px;
    gap: 25px;
    line-height: 1.2;
    margin-bottom: 20px;

    p {
        margin-bottom: 0;
        font-size: 0.9rem;
    }
}

.no-account-p {
    font-size: 0.9rem;
    display: flex;
    gap: 3px;
    margin-bottom: 0;

    a {
        font-size: 0.9rem;
        color: #2d71ea;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
