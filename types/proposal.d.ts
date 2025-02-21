export {};

declare global {
  interface Proposal {
    /** A paragraph explaining the understanding of the project */
    scope: string;
    nDaysWork: number;

    /** When is the project due */
    due: string;

    /** Sum up which item need to be done .e.g pages, api integrations... */
    deliverables: string[];
  }
}
