"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { finalCta, pricing, tryIt } from "@/content/site";
import { Dock, MagneticButton } from "@/components/ui/primitives";
import { FORM_DEMO, FORM_ENDPOINT, LEGAL_EVENT } from "@/lib/form-config";
import { TIER_EVENT } from "./Pricing";
import { SplitReveal } from "@/components/ui/SplitReveal";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const F = finalCta.form;

const field =
  "peer block w-full border-0 border-b border-[color:var(--page-line)] bg-transparent px-0 pb-3 pt-6 text-[17px] text-[color:var(--page-fg)] outline-none transition-colors duration-300 placeholder:text-transparent focus:border-cobalt";
const floating =
  "pointer-events-none absolute left-0 top-6 origin-left text-[15px] text-[color:var(--page-muted)] transition-all duration-300 peer-focus:top-0 peer-focus:text-[12px] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[12px]";
const selectCls =
  "mt-1 block w-full appearance-none border-0 border-b border-[color:var(--page-line)] bg-transparent pb-3 pt-2 text-[17px] text-[color:var(--page-fg)] outline-none focus:border-cobalt";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [tier, setTier] = useState("pair");
  const [finish, setFinish] = useState("basalt");

  useEffect(() => {
    const onTier = (e: Event) => setTier((e as CustomEvent<string>).detail);
    const onFinish = (e: Event) => setFinish((e as CustomEvent<string>).detail);
    window.addEventListener(TIER_EVENT, onTier);
    window.addEventListener("finish:choose", onFinish);
    return () => {
      window.removeEventListener(TIER_EVENT, onTier);
      window.removeEventListener("finish:choose", onFinish);
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!data.name?.trim()) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) errs.email = "Please enter a valid email, like name@example.com.";
    if ((data.message ?? "").length > 2000) errs.message = "Please keep your message under 2,000 characters.";
    if (!data.consent) errs.consent = "Please agree to the privacy policy so we can reply.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      if (FORM_DEMO) {
        await new Promise((r) => setTimeout(r, 900));
      } else {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, consent: true }),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" data-stage="contact" aria-labelledby="contact-title" className="relative pb-16 pt-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20 grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <SplitReveal id="contact-title" text={finalCta.title} className="text-sheen t-display text-[clamp(2.8rem,1.4rem+5.4vw,6.5rem)]" />
          <p className="t-lead mt-6 max-w-[30ch]">{finalCta.lead}</p>
          <Dock id="dock-contact" className="mt-6 hidden aspect-square w-full max-w-[420px] md:block" />
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-t border-cobalt pt-8" role="status">
                <p className="t-h3">{F.successTitle}</p>
                <p className="t-body mt-3 max-w-[44ch]">{FORM_DEMO ? F.demoSuccess : F.success}</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-[15px] underline underline-offset-4">
                  {F.again}
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-7">
                {/* honeypot for bots */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-px w-px" aria-hidden />

                <div className="grid gap-7 sm:grid-cols-2">
                  <div className="relative">
                    <input id="f-name" name="name" autoComplete="name" placeholder=" " className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
                    <label htmlFor="f-name" className={floating}>
                      {F.name}
                    </label>
                    {errors.name && <p id="e-name" className="mt-2 text-[13px] text-[#ff8a8a]">{errors.name}</p>}
                  </div>
                  <div className="relative">
                    <input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder=" " className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
                    <label htmlFor="f-email" className={floating}>
                      {F.email}
                    </label>
                    {errors.email && <p id="e-email" className="mt-2 text-[13px] text-[#ff8a8a]">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-tier" className="block text-[12px] text-[color:var(--page-muted)]">
                      {F.tier}
                    </label>
                    <select id="f-tier" name="tier" value={tier} onChange={(e) => setTier(e.target.value)} className={selectCls}>
                      {pricing.tiers.map((t) => (
                        <option key={t.id} value={t.id} className="text-ink">
                          {t.name} — {pricing.currency}
                          {t.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-finish" className="block text-[12px] text-[color:var(--page-muted)]">
                      {F.finish}
                    </label>
                    <select id="f-finish" name="finish" value={finish} onChange={(e) => setFinish(e.target.value)} className={selectCls}>
                      {tryIt.finishes.map((f) => (
                        <option key={f.id} value={f.id} className="text-ink">
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea id="f-msg" name="message" rows={3} placeholder=" " className={`${field} resize-none`} aria-invalid={!!errors.message} />
                  <label htmlFor="f-msg" className={floating}>
                    {F.message}
                  </label>
                  {errors.message && <p className="mt-2 text-[13px] text-[#ff8a8a]">{errors.message}</p>}
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-[14px] text-[color:var(--page-muted)]">
                    <input type="checkbox" name="consent" value="yes" className="mt-0.5 h-4 w-4 shrink-0 accent-[#3047ff]" aria-invalid={!!errors.consent} />
                    <span>{F.consent}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent(LEGAL_EVENT, { detail: "privacy" }))}
                    className="ml-7 mt-1 text-[13px] text-[color:var(--page-muted)] underline underline-offset-2 hover:text-[color:var(--page-fg)]"
                  >
                    Read the privacy policy
                  </button>
                  {errors.consent && <p className="mt-2 text-[13px] text-[#ff8a8a]">{errors.consent}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <MagneticButton type="submit" disabled={status === "sending"} className="disabled:opacity-60">
                    {status === "sending" ? F.sending : F.submit}
                  </MagneticButton>
                  {status === "error" && (
                    <p role="alert" className="max-w-[36ch] text-[14px] text-[#ff8a8a]">
                      {F.error}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
