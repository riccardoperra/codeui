import type { PaginationProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type Pagination = Pick<PaginationProps, "page" | "onChange" | "size" | "rounded">;
export type PaginationInherited = Pick<PaginationProps, "pages" | "initialPage" | "maxPages" | "showFirst" | "showLast" | "showPrev" | "showNext" | "firstContent" | "lastContent" | "prevContent" | "nextContent">;
export const notes = {
 Pagination: {
  page: { description: "Controlled current page, starting at 1." },
  onChange: { description: "Runs when the page changes, after initialization." },
  size: { default: '"md"', description: "Size of every page button." },
  rounded: { default: "false", description: "Uses pill buttons." },
 },
 PaginationInherited: {
  pages: { description: "Total page count. Supply a positive integer." },
  initialPage: { default: "1", description: "Initial page when page is absent." },
  maxPages: { default: "5", description: "Maximum numeric buttons. Navigation controls are additional." },
  showFirst: { default: "false", description: "Shows first-page navigation, or computes visibility." },
  showLast: { default: "false", description: "Shows last-page navigation, or computes visibility." },
  showPrev: { default: "true", description: "Shows previous-page navigation, or computes visibility." },
  showNext: { default: "true", description: "Shows next-page navigation, or computes visibility." },
  prevContent: { default: "PreviousIcon", description: "Content of the previous button." },
  nextContent: { default: "NextIcon", description: "Content of the next button." },
 },
} satisfies PropNotes;
