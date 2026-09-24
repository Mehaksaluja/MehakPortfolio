import { useEffect, useMemo, useRef, useState } from 'react';
import { profile, sections, social } from '../data/profile';

const buildCommands = (close) => [
  ...sections.map((section) => ({
    id: `goto-${section.id}`,
    group: 'Go to',
    label: section.label,
    run: () => {
      close();
      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  })),
  ...social.map((link) => ({
    id: `open-${link.label}`,
    group: 'Open',
    label: link.label,
    run: () => window.open(link.url, '_blank', 'noopener'),
  })),
  {
    id: 'copy-email',
    group: 'Copy',
    label: profile.email,
    run: () => navigator.clipboard?.writeText(profile.email),
  },
];

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => buildCommands(onClose), [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[active]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-90 flex items-start justify-center px-5 pt-[16vh]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-page/85"
      />

      <div className="relative w-full max-w-md border border-rule-lit bg-page">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="w-full border-b border-rule bg-transparent px-4 py-3 text-[14px] text-ink placeholder:text-faint focus:outline-none"
        />

        <div className="max-h-[42vh] overflow-y-auto">
          {results.length === 0 && (
            <p className="px-4 py-5 text-[14px] text-faint">No matches.</p>
          )}

          {results.map((command, i) => (
            <button
              key={command.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={command.run}
              className={`flex w-full items-baseline gap-4 px-4 py-2.5 text-left transition-colors ${
                i === active ? 'bg-rule/60' : ''
              }`}
            >
              <span className="label w-12 shrink-0">{command.group}</span>
              <span className={`text-[13px] ${i === active ? 'text-ink' : 'text-body'}`}>
                {command.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
