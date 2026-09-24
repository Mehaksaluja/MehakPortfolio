export const SectionHead = ({ title, meta }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-4">
    <h2 className="font-serif text-[1.65rem] font-medium tracking-[-0.02em] text-ink">{title}</h2>
    {meta && <span className="label text-right">{meta}</span>}
  </div>
);

const Section = ({ id, children }) => (
  <section id={id} className="mx-auto max-w-[62rem] scroll-mt-16 px-6 pt-4 pb-24 md:px-10">
    {children}
  </section>
);

export default Section;
