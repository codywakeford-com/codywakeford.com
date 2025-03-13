import { type ApiPdfIndex } from "~~/server/api/pdf/[type]/index.post"

namespace PdfService {
    export interface GenerateQuote {
        Params: {
            projectId: string
            quoteItems: QuoteItem[]
            totalAmount: number
            recieptName: string
        }
        Return: Promise<{
            projectFile: ProjectFile
        }>
    }

    export interface GenerateInvoice {
        Params: {
            projectId: string
            quoteItems: QuoteItem[]
            totalAmount: number
            recieptName: string
        }
        Return: Promise<{
            projectFile: ProjectFile
        }>
    }

    export interface GenerateProposal {
        Params: {
            projectId: string
            scope: string
            nDaysWork: number
            due: string
            deliverables: string[]
        }

        Return: Promise<{
            projectFile: ProjectFile
        }>
    }
}

export default class PdfService {
    static generateQuote: Func<PdfService.GenerateQuote> = async (params) => {
        const { projectId, quoteItems, totalAmount, recieptName } = params

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

        const projectFile = await $fetch<ApiPdfIndex.Response>(`/api/pdf/quote`, {
            method: "post",
            body: { data: { quote, recieptName }, projectId, fileName: "quote.pdf" } as ApiPdfIndex.RequestBody,
        })

        return { projectFile }
    }

    static generateInvoice: Func<PdfService.GenerateInvoice> = async (params) => {
        const { projectId, quoteItems, totalAmount, recieptName } = params

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

        const projectFile = await $fetch<ApiPdfIndex.Response>("/api/pdf/invoice", {
            method: "post",
            body: { data: { quote, recieptName }, projectId, fileName: "invoice.pdf" } as ApiPdfIndex.RequestBody,
        })

        return { projectFile }
    }

    static generateProposal: Func<PdfService.GenerateProposal> = async (params) => {
        const { projectId, scope, due, deliverables, nDaysWork } = params

        const projectFile = await $fetch<ApiPdfIndex.Response>(`/api/pdf/proposal`, {
            method: "POST",
            body: {
                data: { scope, nDaysWork, due, deliverables },
                projectId,
                fileName: "project-proposal.pdf",
            } as ApiPdfIndex.RequestBody,
        })

        return { projectFile }
    }
}
