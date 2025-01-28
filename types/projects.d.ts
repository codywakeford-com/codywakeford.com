export {}

declare global {
    type ProjectPhase = "discovery" | "design" | "development" | "testing" | "launch" | "live"

    /**These are the meetings that can be scheduled. Each one will come with its own description shown to the client. It will also outline the meeting agenda. */
    type MeetingRequestTypes = "discovery" | "design" | "final approval" | "launch"

    interface Action {
        type: "meeting" | "document" | "none" | "payment" | "design-meeting" | "accept-design"
        message?: string
    }

    interface Meeting {
        meetingUrl: string
        name: string
        startTime: string
        cancelUrl: string
        rescheduleUrl: string

        clients: {
            name: string
            email: string
        }[]
    }

    interface Project {
        id: string
        name: string
        emails: string[]
        phase: ProjectPhase
        action: Action[]
        meeting?: Meeting

        design: {
            url?: string
            accepted: boolean
        }

        domain?: string
        quote?: ProjectQuote
    }

    interface ProjectQuote {
        files: ProjectFile[]

        /**Total of all the payment type items. E.g subscriptions not included. */
        totalAmount: number

        /**Total amount paid. */
        amountPaid: number

        /**Quote has been accepted by the client */
        accepted?: boolean
    }

    interface ProjectQuoteItem {
        /**Name of the product or service */
        name: "website"

        /**Amount in pence */
        amount: number

        /**Type of payment for the transaction */
        paymentType: "payment" | "subscription"
    }
}
