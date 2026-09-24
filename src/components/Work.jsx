import { useState } from 'react';
import { work } from '../data/work';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const PREVIEW = 3;

const ProjectCard = ({ project, index }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20">
    <div className="relative overflow-hidden border-b border-line">
      <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-page/70 px-2 py-0.5 text-[11px] text-ink backdrop-blur-sm">
        {String(index + 1).padStart(2, '0')}
      </span>

      {project.image ? (
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top opacity-85 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
        />
      ) : (
        // Projects with no screenshot — a CLI, say — still need a header block.
        <div className="grid aspect-[16/10] w-full place-items-center bg-[linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] bg-[length:22px_22px]">
          <span className="text-3xl font-semibold tracking-tight text-ink/15 transition-colors duration-500 group-hover:text-ink/25">
            {project.title}
          </span>
        </div>
      )}
    </div>
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink">{project.title}</h3>
        <span className="shrink-0 text-[12px] text-faint">{project.year}</span>
      </div>
      <p className="mt-0.5 text-[12.5px] text-faint">{project.kind}</p>

      <p className="mt-2 line-clamp-3 text-[14px] leading-snug text-muted">{project.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 3).map((item) => (
          <span key={item} className="rounded-full border border-line px-2 py-0.5 text-[12px] text-faint">
            {item}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      <div className="mt-3.5 flex items-center gap-4 text-[13px]">
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-ink hover:underline">
            Live ↗
          </a>
        )}
        {project.source && (
          <a href={project.source} target="_blank" rel="noopener noreferrer" className="text-faint hover:text-ink">
            Repo ↗
          </a>
        )}
      </div>
    </div>
  </article>
);

const Work = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? work : work.slice(0, PREVIEW);

  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 pt-24 lg:px-10">
      <SectionTitle eyebrow="Featured" title="Projects" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, i) => (
          <Reveal key={project.id} variant="tilt" delay={(i % 3) * 110}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>

      {work.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setShowAll((open) => !open)}
          className="mt-10 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink/25 hover:bg-ink/5"
        >
          {showAll ? 'Show less' : 'Show all projects'}
        </button>
      )}
    </section>
  );
};

export default Work;
