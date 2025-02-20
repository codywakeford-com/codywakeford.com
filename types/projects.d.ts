export {};

declare global {
  type ProjectPhase =
    | "discovery"
    | "design"
    | "development"
    | "testing"
    | "launch"
    | "live";

  interface Project {
    id: string;
    emails: string[];
    phase: ProjectPhase;

    /** 
    Full - Discovery, design and building of the website 
    Build - Build from existing design doc.
    */
    type: "full" | "build";

    design: {
      url?: string;
      accepted: boolean;
    };

    domain?: string;
    quote?: ProjectQuote;
  }

  interface ProjectQuote {
    files: ProjectFile[];

    /**Total of all the payment type items. E.g subscriptions not included. */
    totalAmount: number;

    /**Total amount paid. */
    amountPaid: number;

    /**Quote has been accepted by the client */
    accepted?: boolean;
  }

  interface ProjectQuoteItem {
    /**Name of the product or service */
    name: "website";

    /**Amount in pence */
    amount: number;

    /**Type of payment for the transaction */
    paymentType: "payment" | "subscription";
  }
}
