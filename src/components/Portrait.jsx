import { useState } from 'react';
import { profile } from '../data/profile';

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('');

const Portrait = () => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="group relative shrink-0">
      <span className="absolute -inset-4 rounded-full bg-ink/[0.06] blur-2xl" />

      {/* A ring that traces the portrait, slowly. */}
      <span className="absolute -inset-1.5 animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--ink)_70deg,transparent_150deg)] opacity-25" />
      <span className="absolute -inset-1.5 rounded-full bg-page" />

      <div className="relative h-28 w-28 overflow-hidden rounded-full border border-line bg-card sm:h-32 sm:w-32">
        {failed ? (
          <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-faint">
            {initials}
          </span>
        ) : (
          <img
            src={profile.photo}
            alt={profile.name}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
    </div>
  );
};

export default Portrait;
