export {}

declare global {
    type ProjectPhase = "discovery" | "design" | "development" | "final-approval" | "testing" | "launch"

    /**These are the meetings that can be scheduled. Each one will come with its own description shown to the client. It will also outline the meeting agenda. */
    type MeetingRequestTypes = "discovery" | "design" | "final approval" | "launch"

    type Actions = "meeting" | "document" | "none" | "payment"

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
        /**Db reference id */
        id: string

        /**Name of the project e.g. client/ company name */
        name: string

        /**List of all clients that have access to the project details */
        emails: string[]

        /**What phase the project is in. */
        phase: ProjectPhase
        action?: Actions
        meeting?: Meeting

        /**
         * What kind of payment plan does the client use.
         *
         * - One: Payment in full upfront.
         *
         * - Three: One payment upfront, once on first built website draft and once on completion.
         *
         * - Installments: A reccuring monthly payment for the site. //TODO
         *
         */
        paymentPlan: "noneSelected" | "three" | "installments" | "one"

        /**A breif description of the project scope */
        description?: string

        /**Company domain name */
        domain?: string

        /**The company or person the project is for. */
        companyName: string

        demoLink?: string

        quote?: ProjectQuote
    }

    interface ProjectQuote {
        /**items/ services being purchased */
        items: ProjectQuoteItem[]

        /**Url link to pdf. */
        quoteUrl: string

        /**Url link to pdf. */
        proposalUrl: string

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
