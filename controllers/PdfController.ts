import PdfService from "~~/services/PdfService"

namespace PdfService {
    export interface GenerateQuoteAndProposal {
        Params: {
            projectId: string
            quoteItems: QuoteItem[]
            amount: number
            recieptName: string
            scope: string
            nDaysWork: number
            due: string
            deliverables: string[]
        }

        Return: Promise<{
            invoice: ProjectFile
            quote: ProjectFile
            proposal: ProjectFile
        }>
    }
}

export default class PdfController {
    static generateQuoteAndProposal: Func<PdfService.GenerateQuoteAndProposal> = async (params) => {
        const { projectId, quoteItems, amount, recieptName, scope, nDaysWork, due, deliverables } = params

        const { projectFile: quote } = await PdfService.generateQuote({
            projectId,
            quoteItems,
            totalAmount: amount,
            recieptName,
        })

        const { projectFile: invoice } = await PdfService.generateInvoice({
            projectId,
            quoteItems,
            totalAmount: amount,
            recieptName,
        })

        const { projectFile: proposal } = await PdfService.generateProposal({
            projectId,
            scope,
            nDaysWork,
            due,
            deliverables,
        })

        return { invoice, quote, proposal }
    }

    static async generateWebsiteSummaryReport(url: string) {}
}
