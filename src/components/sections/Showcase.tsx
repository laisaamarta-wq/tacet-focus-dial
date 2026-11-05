/* eslint-disable @next/next/no-img-element -- static renders, also used in the single-file HTML build */
import { showcase } from "@/content/site";
import { Dock } from "@/components/ui/primitives";
import { SplitReveal } from "@/components/ui/SplitReveal";

/**
 * Visual presentation: product renders around a status card.
 * The live 3D object docks into the card — the 3D-to-interface moment.
 */
export function Showcase() {
  const [studio, crown, top] = showcase.images;
  const c = showcase.card;
  return (
    <section id="showcase" data-stage="showcase" aria-labelledby="showcase-title" className="relative py-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative">
        <div className="relative z-20 grid gap-6 md:grid-cols-12 md:items-end">
          <SplitReveal id="showcase-title" text={showcase.title} className="text-sheen t-h2 md:col-span-7" />
          <p className="t-lead max-w-[36ch] md:col-span-4 md:col-start-9">{showcase.lead}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <figure className="relative overflow-hidden rounded-[10px] bg-[#15191b] md:col-span-5">
            <img src={studio.src} alt={studio.alt} width={1200} height={1500} loading="lazy" decoding="async" className="h-full w-full object-cover md:min-h-[640px]" />
            <figcaption className="absolute bottom-4 left-5 text-[13px] text-[#cfd2cf]">{studio.caption}</figcaption>
          </figure>

          {/* Status card: the 3D object lands here */}
          <div className="relative flex flex-col rounded-[28px] bg-chalk text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] md:col-span-4">
            <div className="relative z-20 flex items-center justify-between px-6 pt-5 text-[13px] text-graphite">
              <span>{c.app}</span>
              <span className="tabular">11:02</span>
            </div>
            <div className="relative rounded-t-[28px]">
              <Dock id="dock-showcase" className="aspect-square w-full" />
            </div>
            <div className="relative z-20 mt-auto p-6">
              <div className="flex items-center gap-3">
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-chalk">
                  AM
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="flex items-center gap-2 text-[13px] text-cobalt">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt" />
                    </span>
                    {c.state} {c.until}
                  </p>
                </div>
              </div>
              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {c.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-3 text-[14px]">
                    <dt className="text-graphite">{r.label}</dt>
                    <dd className="tabular font-medium">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[12px] text-graphite">{c.note}</p>
            </div>
          </div>

          <div className="grid gap-4 md:col-span-3 md:gap-5">
            {[crown, top].map((im) => (
              <figure key={im.src} className="relative overflow-hidden rounded-[10px] bg-[#15191b]">
                <img src={im.src} alt={im.alt} width={800} height={800} loading="lazy" decoding="async" className="aspect-square h-full w-full object-cover" />
                <figcaption className="absolute bottom-4 left-5 text-[13px] text-[#cfd2cf]">{im.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
