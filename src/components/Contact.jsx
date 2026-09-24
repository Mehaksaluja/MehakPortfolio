import { useState } from 'react';
import { profile, social } from '../data/profile';
import Reveal from './Reveal';

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24 pb-14 lg:px-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-card/60">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[34rem] -translate-x-1/2 rounded-full bg-ink/[0.07] blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
          />

          <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-2.5 py-1 text-[13px] text-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Let&apos;s build something
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                Open to internships and engineering roles. Email is quickest, or tap the call button
                to ask my voice assistant about my work.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={copy}
                  className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-page transition-transform hover:-translate-y-0.5"
                >
                  {copied ? 'Copied' : profile.email}
                </button>
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-full border border-line px-4 py-2 text-[13.5px] text-ink transition-colors hover:border-ink/25 hover:bg-ink/5"
                >
                  Open mail
                </a>
              </div>
            </div>

            {/* Links as their own ruled list, rather than a row of small text. */}
            <div className="border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              <p className="text-[12.5px] text-faint">Elsewhere</p>
              <ul className="mt-3">
                {social.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-line py-2.5 text-[15px] text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                      <span className="text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[13px] text-faint">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
};

export default Contact;
