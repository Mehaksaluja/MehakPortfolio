import Reveal from './Reveal';

const SectionTitle = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between gap-6">
    <div>
      <Reveal as="p" variant="slide" className="flex items-center gap-2 text-sm text-faint">
        <span className="h-px w-6 bg-line" />
        {eyebrow}
      </Reveal>
      <Reveal
        as="h2"
        variant="wipe"
        delay={110}
        className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </Reveal>
    </div>
    {action && <Reveal delay={200}>{action}</Reveal>}
  </div>
);

export default SectionTitle;
