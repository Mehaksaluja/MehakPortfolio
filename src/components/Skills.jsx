import { useState } from 'react';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const groups = [
  {
    name: 'Frontend',
    blurb: 'Interfaces, state and routing.',
    items: [
      { name: 'React', level: 92 },
      { name: 'Next.js', level: 78 },
      { name: 'JavaScript', level: 90 },
      { name: 'Tailwind CSS', level: 88 },
      { name: 'HTML', level: 95 },
      { name: 'CSS', level: 90 },
    ],
  },
  {
    name: 'Backend',
    blurb: 'APIs, auth and services.',
    items: [
      { name: 'Node.js', level: 88 },
      { name: 'Express', level: 86 },
      { name: 'FastAPI', level: 74 },
      { name: 'Python', level: 82 },
      { name: 'REST APIs', level: 90 },
    ],
  },
  {
    name: 'Data',
    blurb: 'Schemas, queries and storage.',
    items: [
      { name: 'MongoDB', level: 88 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'Firebase', level: 82 },
      { name: 'SQL', level: 76 },
    ],
  },
  {
    name: 'AI & agents',
    blurb: 'Retrieval, tools and orchestration.',
    items: [
      { name: 'LangChain', level: 82 },
      { name: 'LangGraph', level: 78 },
      { name: 'RAG', level: 80 },
      { name: 'Tool calling', level: 78 },
      { name: 'OpenAI API', level: 86 },
      { name: 'Groq', level: 74 },
    ],
  },
  {
    name: 'Mobile',
    blurb: 'Cross-platform apps.',
    items: [
      { name: 'Flutter', level: 84 },
      { name: 'Dart', level: 80 },
    ],
  },
  {
    name: 'Tooling',
    blurb: 'Build, ship and host.',
    items: [
      { name: 'Git', level: 90 },
      { name: 'GitHub', level: 90 },
      { name: 'Vite', level: 82 },
      { name: 'AWS', level: 64 },
      { name: 'Vercel', level: 86 },
      { name: 'Render', level: 80 },
    ],
  },
];

const allNames = groups.flatMap((group) => group.items.map((item) => item.name));

/* Three bands, alternating direction and speed, so the motion reads as a weave. */
const bands = [
  { items: allNames, duration: '46s', reverse: false },
  { items: [...allNames].reverse(), duration: '38s', reverse: true },
  { items: [...allNames.slice(8), ...allNames.slice(0, 8)], duration: '54s', reverse: false },
];

const Marquee = ({ items, duration, reverse }) => (
  <div className="group flex overflow-hidden">
    {[0, 1].map((copy) => (
      <div
        key={copy}
        aria-hidden={copy === 1}
        className="flex shrink-0 items-center gap-2.5 pr-2.5 group-hover:[animation-play-state:paused]"
        style={{
          animation: `drift ${duration} linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line px-3 py-1 text-[13px] whitespace-nowrap text-faint transition-colors hover:border-ink/30 hover:text-ink"
          >
            {item}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const Skills = () => {
  const [active, setActive] = useState(0);
  const group = groups[active];

  return (
    <section id="skills" className="scroll-mt-24 pt-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <SectionTitle eyebrow="Toolkit" title="Skills" />
      </div>

      <div className="mt-8 space-y-2.5 border-y border-line py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {bands.map((band) => (
          <Marquee key={band.duration} {...band} />
        ))}
      </div>

      <Reveal className="mx-auto mt-12 max-w-6xl px-5 lg:px-10">
        <div className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-10">
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {groups.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActive(i)}
                className={`group relative flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors md:w-full ${
                  i === active ? 'bg-ink/[0.07] text-ink' : 'text-faint hover:bg-ink/[0.03] hover:text-ink'
                }`}
              >
                {/* Marks the open category. */}
                <span
                  className={`absolute top-1/2 left-0 h-5 w-[2px] -translate-y-1/2 rounded-full bg-ink transition-transform duration-300 ${
                    i === active ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
                {item.name}
                <span className="text-[12px] text-faint">
                  {String(item.items.length).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          {/* Meters redraw each time a category opens, keyed to remount. */}
          <div key={group.name} className="rounded-2xl border border-line bg-card/60 p-5 sm:p-6">
            <p className="text-[15px] text-muted">{group.blurb}</p>

            <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {group.items.map((item, i) => (
                <div key={item.name}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[14px] text-ink">{item.name}</span>
                    <span className="text-[12px] text-faint">{item.level}</span>
                  </div>
                  <span className="mt-2 block h-[3px] rounded-full bg-line">
                    <span
                      className="relative block h-full rounded-full bg-gradient-to-r from-ink/25 to-ink"
                      style={{
                        animation: `fill 1s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms backwards`,
                        width: `${item.level}%`,
                      }}
                    >
                      <span className="absolute top-1/2 right-0 size-[7px] -translate-y-1/2 translate-x-1/2 rounded-full bg-ink shadow-[0_0_8px_var(--ink)]" />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Skills;
