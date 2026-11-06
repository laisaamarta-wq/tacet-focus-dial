import { testimonials } from "@/content/site";
import { SplitReveal } from "@/components/ui/SplitReveal";

function Rating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative h-3 w-1.5 overflow-hidden rounded-[1px] bg-[color:var(--page-line)]">
              <span className="absolute inset-y-0 left-0 bg-cobalt" style={{ width: `${fill * 100}%` }} />
            </span>
          );
        })}
      </span>
      <span className="tabular t-small">{value.toString().replace(".", ",")}</span>
    </span>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" data-stage="testimonials" aria-labelledby="t-title" className="relative pb-[clamp(3rem,8vh,6rem)] pt-[clamp(3.5rem,8vh,5rem)] md:pt-[clamp(6rem,14vh,11rem)]">
      <div className="container-x relative z-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal id="t-title" text={testimonials.title} className="text-sheen t-h2" />
          <p className="max-w-[46ch] rounded-full border border-cobalt/50 px-4 py-2 text-[13px] text-cobalt">{testimonials.note}</p>
        </div>
      </div>

      <div
        className="relative z-20 mt-14 flex snap-x snap-mandatory gap-0 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent-wheel=""
        tabIndex={0}
        aria-label="Reviews, scroll horizontally"
      >
        <div className="shrink-0 pl-[max(1rem,calc((100vw-1440px)/2+clamp(1rem,0.5rem+2.5vw,3rem)))]" aria-hidden />
        {testimonials.items.map((t, i) => (
          <figure
            key={i}
            className="glass mr-4 flex w-[min(84vw,400px)] shrink-0 snap-start flex-col justify-between rounded-[22px] p-6 md:w-[380px] md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <Rating value={t.rating} />
              <span className="t-small">Demo</span>
            </div>
            <blockquote className="mt-8 font-display text-[clamp(1.25rem,1.05rem+0.7vw,1.6rem)] font-[300] leading-[1.25] tracking-[-0.02em]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-10">
              <span className="block font-medium">{t.role}</span>
              <span className="t-small">{t.name}</span>
            </figcaption>
          </figure>
        ))}
        <div className="w-[clamp(1rem,0.5rem+2.5vw,3rem)] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
