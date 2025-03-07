import PdfService from "~~/services/PdfService"

export default class PdfController {
    static async generateQuoteAndProposal(projectId: string, quoteItems: any[], amount: number, recieptName: string) {
        const { quoteUrl } = await PdfService.generateQuote(projectId, quoteItems, amount, recieptName)
        const { invoiceUrl } = await PdfService.generateInvoice(projectId, quoteItems, amount, recieptName)

        console.log(quoteUrl, invoiceUrl)

        return { quoteDocUrl: quoteUrl, invoiceDocUrl: invoiceUrl, proposalDocUrl: "" }
        // const { proposalDocUrl } = await PdfService.generateProposal()
    }
}
