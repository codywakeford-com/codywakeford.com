export async function getCardMetadata(paymentMethodId: string) {
    try {
        const response = await $fetch(`/api/stripe/${paymentMethodId}/card-metadata`)

        return response
    } catch (error) {
        console.error(error)
    }
}
