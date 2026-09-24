import { useCallback, useEffect, useRef, useState } from 'react';
import { startAssistant, stopAssistant, vapi } from '../ai';
import { profile } from '../data/profile';

const PhoneIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
  </svg>
);

const EndIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <path d="M3 3l18 18M10.7 5.1A10 10 0 0 1 22 9v2M2 11V9a10 10 0 0 1 4.6-3.5" />
    <path d="M14 14l-1.5 1.5a16 16 0 0 1-4-4L10 10" />
  </svg>
);

const STATUS = {
  idle: 'Talk to my AI',
  dialing: 'Connecting…',
  live: 'Listening',
  speaking: 'Speaking',
};

/** Level meter shared by the popover and the full-screen view. */
const Bars = ({ speaking, className = '', width = 3 }) => (
  <div className={`flex items-end gap-[3px] ${className}`}>
    {[0, 1, 2, 3].map((bar) => (
      <span
        key={bar}
        className={`rounded-full bg-emerald-400 ${
          speaking ? 'animate-[pulseBar_0.9s_ease-in-out_infinite]' : ''
        }`}
        style={{
          width,
          height: speaking ? '100%' : '35%',
          animationDelay: `${bar * 110}ms`,
        }}
      />
    ))}
  </div>
);

const VoiceAgent = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const ring = useRef(null);
  // Vapi can emit trailing events after a hang-up; they must not revive the call.
  const wanted = useRef(false);

  const stopRing = useCallback(() => {
    if (ring.current) {
      ring.current.pause();
      ring.current.currentTime = 0;
    }
  }, []);

  const reset = useCallback(() => {
    wanted.current = false;
    stopRing();
    setState('idle');
  }, [stopRing]);

  useEffect(() => {
    const onSpeechStart = () => wanted.current && setState('speaking');
    const onSpeechEnd = () => wanted.current && setState('live');
    const onCallStart = () => {
      if (!wanted.current) return;
      stopRing();
      setState('live');
    };
    const onCallEnd = () => {
      reset();
      setOpen(false);
    };
    const onError = () => {
      reset();
      setError('Could not connect. Try again.');
    };

    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('error', onError);
      stopRing();
    };
  }, [reset, stopRing]);

  // Nothing should scroll behind the full-screen call view.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const begin = async () => {
    wanted.current = true;
    setError('');
    setOpen(true);
    setState('dialing');

    if (ring.current) {
      ring.current.loop = true;
      ring.current.volume = 0.5;
      ring.current.play().catch(() => {});
    }

    try {
      await startAssistant('Guest', 'Visitor', 'guest@example.com', '0000000000');
    } catch {
      reset();
      setError('Voice agent is not configured.');
    }
  };

  const end = async () => {
    reset();
    setOpen(false);
    try {
      await stopAssistant();
    } catch {
      /* call already closed */
    }
  };

  const active = state !== 'idle';
  const speaking = state === 'speaking';

  return (
    <>
      <audio ref={ring} src="/assets/calling-sound.mp3" preload="none" className="hidden" />

      {/* On phones the call takes over the screen the way a native one does. */}
      {open && (
        <div className="fixed inset-0 z-70 flex flex-col items-center justify-between bg-page/95 px-8 pt-20 pb-14 backdrop-blur-xl sm:hidden">
          <p className="text-[13px] tracking-[0.18em] text-faint uppercase">Voice assistant</p>

          <div className="flex flex-col items-center">
            <div className="relative grid place-items-center">
              {active && (
                <>
                  <span className="absolute size-44 animate-ping rounded-full border border-emerald-400/30 [animation-duration:2.4s]" />
                  <span className="absolute size-36 animate-ping rounded-full border border-emerald-400/40 [animation-duration:2.4s] [animation-delay:600ms]" />
                </>
              )}
              <img
                src={profile.photo}
                alt=""
                className="relative size-28 rounded-full object-cover"
              />
            </div>

            <p className="mt-8 text-2xl font-semibold text-ink">{STATUS[state]}</p>
            <p className="mt-1.5 text-[15px] text-faint">Ask anything about my work</p>

            <Bars speaking={speaking} width={4} className="mt-7 h-9" />

            {error && <p className="mt-6 text-[13px] text-red-400">{error}</p>}
          </div>

          <button
            type="button"
            onClick={end}
            aria-label="End call"
            className="grid size-16 place-items-center rounded-full bg-red-500 text-white transition-transform active:scale-90"
          >
            <EndIcon className="size-6" />
          </button>
        </div>
      )}

      <div className="fixed right-4 bottom-4 z-60 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        {open && (
          <div className="hidden w-60 rounded-2xl border border-line bg-card/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:block">
            <div className="flex items-center gap-3">
              <Bars speaking={speaking} className="h-6" />

              <div>
                <p className="text-[14px] font-medium text-ink">{STATUS[state]}</p>
                <p className="text-[12px] text-faint">Ask about my work</p>
              </div>
            </div>

            {error && <p className="mt-3 text-[12px] text-red-400">{error}</p>}

            <button
              type="button"
              onClick={end}
              className="mt-4 w-full rounded-full border border-line py-2 text-[13px] text-ink transition-colors hover:border-ink/25 hover:bg-ink/5"
            >
              End call
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={active ? end : begin}
          aria-label={active ? 'End call' : 'Talk to my AI assistant'}
          className={`group relative grid h-14 w-14 place-items-center rounded-full border border-line bg-card text-ink shadow-xl transition-transform hover:scale-105 active:scale-95 ${
            open ? 'max-sm:hidden' : ''
          }`}
        >
          {state === 'dialing' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
          )}
          <span className="absolute -inset-px rounded-full bg-gradient-to-b from-ink/15 to-transparent" />
          {active ? <EndIcon className="relative h-5 w-5" /> : <PhoneIcon className="relative h-5 w-5" />}
        </button>
      </div>
    </>
  );
};

export default VoiceAgent;
