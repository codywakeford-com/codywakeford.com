export default class PdfService {
    static async generateQuote(projectId: string, quoteItems: any[], totalAmount: number, recieptName: string) {
        const quote: Quote = {
            id: uuid(),
            discount: 0,
            items: quoteItems,
            projectId: projectId,
            timestamp: Date.now(),
            currency: "gbp",
            taxRate: 0,
            status: "sent",
            totalAmount,
        }

        const quoteUrl = await $fetch(`/api/pdf/quote`, {
            method: "post",
            body: { quote, recieptName },
        })

        return { quoteUrl }
    }

    static async generateInvoice(projectId: string, quoteItems: any[], totalAmount: number, recieptName: string) {
        const quote: Quote = {
            id: uuid(),
            discount: 0,
            items: quoteItems,
            projectId: projectId,
            timestamp: Date.now(),
            currency: "gbp",
            taxRate: 0,
            status: "sent",
            totalAmount,
        }

        const invoiceUrl = await $fetch("/api/pdf/invoice", {
            method: "post",
            body: { quote, recieptName },
        })

        return { invoiceUrl }
    }

    static async generateProposal(scope: string, nDaysWork: number, due: string, deliverables: string[]) {
        const proposalDocUrl = await $fetch(`/api/pdf/proposal`, {
            method: "POST",
            body: { scope, nDaysWork, due, deliverables },
        })

        return { proposalDocUrl }
    }
}
