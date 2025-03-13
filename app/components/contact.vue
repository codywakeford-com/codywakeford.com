<template>
    <section id="contact">
        <!-- <div class="pattern-background" /> -->
        <content>
            <section-sub-header color="dark">
                <template #sub>GET IN TOUCH</template>
                <template #header>Im Always Around To Help</template>
            </section-sub-header>

            <div class="row">
                <div class="column left">
                    <div class="contact-box">
                        <h4>Contact Info</h4>

                        <div class="grid">
                            <div class="left">
                                <span>Email:</span>
                                <span>Phone:</span>
                            </div>

                            <div class="right">
                                <nuxt-link to="mailto:cody@codywakeford.com">cody@codywakeford.com</nuxt-link>
                                <nuxt-link to="tel:07570068765">07570068765</nuxt-link>
                            </div>
                        </div>
                    </div>

                    <div class="social-box">
                        <h4>Get Social</h4>
                        <socials />
                    </div>
                    <google-map address="new mills" zoom="5" />
                </div>

                <div class="column right">
                    <div>
                        <h4>Get In Touch</h4>
                        <p>
                            Got a question or ready to bring your project to life? I'd love to hear from you! Whether
                            you're looking for more information about my services, need a quote, or just want to say
                            hello, please fill out the form below, and I'll get back to you as soon as possible. Let's
                            create something amazing together!
                        </p>
                    </div>

                    <form @submit.prevent="sendEmail()">
                        <div class="form-item">
                            <label for="name">Name: *</label>
                            <input
                                @input="nameError = false"
                                :class="{ danger: nameError }"
                                type="text"
                                name="name"
                                v-model="input.name"
                            />
                        </div>

                        <div class="form-item">
                            <label for="email">Email: *</label>
                            <input
                                @input="handleEmailInput()"
                                :class="{ danger: emailError }"
                                type="text"
                                name="email"
                                v-model="input.email"
                                novalidate
                            />
                        </div>

                        <div class="form-item">
                            <label for="message">Message: *</label>
                            <textarea
                                @input="messageError = false"
                                :class="{ danger: messageError }"
                                rows="8"
                                type="text"
                                name="message"
                                v-model="input.message"
                            />
                        </div>

                        <div v-if="errorMessages.length" class="error-messages">
                            <p
                                class="error"
                                v-for="message in errorMessages"
                                :class="{ active: nameError || emailError || messageError }"
                            >
                                {{ message }}
                            </p>
                        </div>
                        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

                        <button-primary-m :loading="false" type="submit">Send Message</button-primary-m>
                    </form>
                </div>
            </div>
        </content>
    </section>
</template>

<script setup lang="ts">
const errorMessages = ref<string[]>([])
const nameError = ref(false)
const emailError = ref(false)
const messageError = ref(false)
const fieldErrorMessage = "All fields must be filled out."
const emailErrorMessage = "Please input a valid email."
const successMessage = ref("")

function handleEmailInput() {
    if (!emailError.value) return

    if (isValidEmail(input.value.email)) {
        const index = errorMessages.value.indexOf(emailErrorMessage)
        errorMessages.value.splice(index, 1)
        emailError.value = false
    }
}

async function sendEmail() {
    errorMessages.value = []

    if (input.value.name.trim() === "") {
        nameError.value = true
        errorMessages.value.push(fieldErrorMessage)
    }

    if (input.value.email.trim() === "") {
        emailError.value = true
        if (!errorMessages.value.includes(fieldErrorMessage)) {
            errorMessages.value.push(fieldErrorMessage)
        }
    }

    if (input.value.message.trim() === "") {
        messageError.value = true
        if (!errorMessages.value.includes(fieldErrorMessage)) {
            errorMessages.value.push(fieldErrorMessage)
        }
    }

    if (!isValidEmail(input.value.email)) {
        emailError.value = true
        errorMessages.value.push(emailErrorMessage)
    }

    if (emailError.value || nameError.value || messageError.value) return

    const email: $MailerEmail = {
        subject: "codywakeford.com enquiry",
        to: "cody@codywakeford.com",
        from: input.value.email,
        text: `
        Name: ${input.value.name}\n
        Email: ${input.value.email}\n
        Message: ${input.value.message}
        `,
    }

    try {
        await $Mailer.send(email)
        successMessage.value = "Email sent successfully. I'll get back to you shortly!"
        input.value = {
            name: "",
            email: "",
            message: "",
        }
    } catch (error) {
        errorMessages.value.push("An error occured while sending the email.")
    }
}

const input = ref({
    name: "",
    email: "",
    message: "",
})
</script>

<style lang="scss" scoped>
.content {
    padding-block: var(--page-gutter);
}

.row {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex-grow: 1;

    gap: 100px;
    padding-block: 50px;

    .column {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 25px;

        &.left {
            flex: 1 1 300px;
        }

        &.right {
            flex: 2 1 400px;
        }
    }
}

.error {
    color: $danger1;
    font-size: 0.9rem;
    display: none;

    &.active {
        display: block;
    }
}

.success-message {
    font-size: 0.9rem;
    color: $success;
}

h4 {
    font-size: 1.3rem;
    font-weight: normal;
    margin-bottom: 10px;
}

.social-box {
    border-top: 1px solid var(--secondary);
    padding-top: 25px;
    margin-top: 10px;
}

.grid {
    display: grid;
    grid-template-columns: 70px auto;
    grid-gap: 20px;

    .left {
        display: flex;
        flex-direction: column;
    }

    .right {
        display: flex;
        flex-direction: column;
    }
}

.google-map {
    border-radius: $border-radius;
    width: 100%;
    padding-bottom: 25px;
}

form {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    .form-item {
        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 7px;
            font-size: 1rem;
        }

        input,
        textarea {
            background: var(--secondary);
            border: none;
            border-radius: $border-radius;
            padding: 10px 5px;
            font-size: 0.8rem;
            resize: none;

            &.danger {
                outline: 1px solid $danger1;
                background: $danger-transparent;

                &:focus {
                    outline: 1px solid $danger1;
                }
            }

            &:focus {
                outline: 1px solid var(--primary);
            }
        }
    }

    button,
    .btn {
        width: min-content;
        white-space: nowrap;
    }
}
</style>
