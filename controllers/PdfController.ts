import PdfService from "~~/services/PdfService"

export default class PdfController {
    static async generateQuoteAndProposal(
        projectId: string,
        quoteItems: any[],
        amount: number,
        recieptName: string,
        scope: string,
        nDaysWork: number,
        due: string,
        deliverables: string[],
    ) {
        const { quoteUrl } = await PdfService.generateQuote(projectId, quoteItems, amount, recieptName)
        const { invoiceUrl } = await PdfService.generateInvoice(projectId, quoteItems, amount, recieptName)
        const { proposalDocUrl } = await PdfService.generateProposal(scope, nDaysWork, due, deliverables)

        return { quoteDocUrl: quoteUrl, invoiceDocUrl: invoiceUrl, proposalDocUrl }
    }
}
