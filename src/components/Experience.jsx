import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const jobs = [
  {
    company: 'Zentosys Solutions',
    role: 'Software Developer Intern',
    dates: 'July 2025 — Present',
    place: 'India',
    current: true,
    points: [
      'Building a transport management portal and a Flutter driver app with live vehicle tracking.',
      'Shipped secure driver authentication and admin controls across the MERN stack.',
    ],
  },
  {
    company: 'Insyble Tech',
    role: 'Web Development Intern',
    dates: 'June 2025 — August 2025',
    place: 'India',
    current: false,
    points: [
      'Built responsive interfaces in React against Node and MongoDB services.',
      'Worked across several client projects in a weekly release cycle.',
    ],
  },
];

const Experience = () => (
  <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-6 pt-24 lg:px-10">
    <SectionTitle eyebrow="Career" title="Experience" />

    <div className="relative mt-8 pl-6 sm:pl-8">
      {/* The spine that threads the roles together. */}
      <span className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-ink/25 via-line to-transparent" />

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <Reveal key={job.company} delay={i * 90} as="article" className="relative">
            <span className="absolute top-5 -left-6 flex h-3 w-3 items-center justify-center sm:-left-8">
              {job.current && (
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-400/60" />
              )}
              <span
                className={`relative h-[11px] w-[11px] rounded-full border-2 ${
                  job.current ? 'border-emerald-400 bg-emerald-400' : 'border-line bg-page'
                }`}
              />
            </span>

            <div className="rounded-xl border border-line bg-card/70 px-4 py-4 transition-colors hover:border-ink/20">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-semibold text-ink">{job.company}</h3>
                  {job.current && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      Working
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-faint">{job.dates}</p>
              </div>

              <p className="mt-0.5 text-[14px] text-muted">
                {job.role}
                <span className="mx-1.5 text-faint">·</span>
                <span className="text-faint">{job.place}</span>
              </p>

              <ul className="mt-2.5 space-y-1">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[14px] leading-snug text-faint">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
