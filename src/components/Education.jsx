import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const RING = 2 * Math.PI * 42;

const study = [
  {
    school: 'Seth Jai Parkash Mukand Lal Institute of Engineering and Technology',
    course: 'B.Tech, Computer Science and Engineering',
    dates: '2023 — 2027',
    score: '8.5',
    unit: 'CGPA',
    progress: 85,
    topics: ['Data structures', 'Databases', 'Operating systems', 'Web development'],
  },
  {
    school: 'DAV Public School, Radaur',
    course: 'Higher Secondary — Class 12',
    dates: '2022 — 2023',
    score: '94.4',
    unit: '%',
    progress: 94.4,
    topics: ['Physics', 'Chemistry', 'Mathematics'],
  },
  {
    school: 'DAV Public School, Radaur',
    course: 'Secondary — Class 10',
    dates: '2020 — 2021',
    score: '92.8',
    unit: '%',
    progress: 92.8,
    topics: ['Science', 'Mathematics', 'English'],
  },
];

const Education = () => (
  <section id="education" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24 lg:px-10">
    <SectionTitle eyebrow="Background" title="Education" />

    <div className="mt-8 space-y-4">
      {study.map((item, i) => (
        <Reveal key={item.course} delay={i * 110} variant="tilt" as="article" className="group/card">
          <div className="group grid gap-5 rounded-xl border border-line bg-card/70 p-5 transition-colors hover:border-ink/20 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
            <div>
              <p className="text-[12.5px] text-faint">{item.dates}</p>
              <h3 className="mt-1 text-[18px] leading-snug font-semibold text-ink">{item.course}</h3>
              <p className="mt-1 text-[14px] text-muted">{item.school}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-line px-2 py-0.5 text-[12px] text-faint"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* The score sits in a ring that draws itself as the card arrives. */}
            <div className="relative grid h-24 w-24 shrink-0 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  className="[stroke-dashoffset:var(--empty)] transition-[stroke-dashoffset] delay-300 duration-[1600ms] ease-out group-data-[shown]/card:[stroke-dashoffset:var(--filled)]"
                  style={{
                    '--empty': RING,
                    '--filled': RING * (1 - item.progress / 100),
                  }}
                />
              </svg>
              <div className="relative text-center">
                <p className="text-[22px] leading-none font-semibold text-ink">{item.score}</p>
                <p className="mt-1 text-[11px] text-faint">{item.unit}</p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Education;
