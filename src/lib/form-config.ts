/**
 * Where the reservation form sends data.
 *
 * - Default (Next.js server): the built-in route at /api/contact.
 * - NEXT_PUBLIC_FORM_ENDPOINT: any service that accepts a JSON POST
 *   (Formspree, Basin, Make, n8n, a serverless function…).
 * - NEXT_PUBLIC_FORM_MODE=demo: nothing is sent; the form shows a demo confirmation.
 *   The single-file HTML build uses this unless an endpoint is provided.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "/api/contact";
export const FORM_DEMO = process.env.NEXT_PUBLIC_FORM_MODE === "demo" && !process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export const LEGAL_EVENT = "legal:open";
