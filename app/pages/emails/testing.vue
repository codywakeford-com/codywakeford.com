<template>
    <div class="email-container">
        <!-- Email Content -->
        <section class="email-content">
            <p>Hello [Recipient Name],</p>
            <p>
                Thank you for subscribing to our newsletter! We're excited to keep you updated with the latest news and
                offers.
            </p>
            <p>
                Best regards,
                <br />
                The Team
            </p>
        </section>

        <!-- Email Signature -->
        <footer class="email-signature">
            <div class="signature-content">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/portfolio-1953f.firebasestorage.app/o/do-not-delete%2Fprofile-pic.jpeg?alt=media&token=13d13832-ca00-4785-afce-e98c9e4b328f"
                    alt="codywakeford"
                    class="headshot"
                />
                <div class="signature-text">
                    <p>
                        <strong>Cody Wakeford</strong>
                        <br />
                        Freelance Web Professional
                        <br />
                        <a href="https://codywakeford.com">codywakeford.com</a>
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "empty",
})
</script>

<style scoped lang="scss">
.email-container {
    font-family: Arial, sans-serif;
    color: #333;
}

.email-header {
    background-color: #f4f4f4;
    padding: 10px;
    text-align: center;
}

.email-header h1 {
    font-size: 24px;
}

.email-content {
    padding: 20px;
    font-size: 16px;
}

.email-signature {
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #ccc;
}

.signature-content {
    display: flex;
    align-items: center;
}
img {
    height: 75px;
    width: 75px;
}
.headshot {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.signature-text p {
    margin: 0;
    font-size: 14px;
}
</style>
