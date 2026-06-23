import { useEffect, useMemo, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';
const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?';
const SENSITIVITY = 0.8;

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let charIndex = 0;
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));

        if (charIndex >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [startDelay, speed, text]);

  return { displayed, done };
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <rect x="5" y="5" width="10" height="10" rx="2" />
    </svg>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);

  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);

  const navLinks = useMemo(
    () => ['Labs', 'Studio', 'Openings', 'Shop'],
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setActionsVisible(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const seekTo = (nextTime: number) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const clamped = Math.min(Math.max(nextTime, 0), duration);
      targetTimeRef.current = clamped;

      if (isSeekingRef.current) {
        pendingTimeRef.current = clamped;
        return;
      }

      isSeekingRef.current = true;
      video.currentTime = clamped;
    };

    const handleSeeked = () => {
      const pendingTime = pendingTimeRef.current;

      if (
        pendingTime !== null &&
        Math.abs(pendingTime - video.currentTime) > 0.01
      ) {
        pendingTimeRef.current = null;
        video.currentTime = pendingTime;
        return;
      }

      pendingTimeRef.current = null;
      isSeekingRef.current = false;

      if (Math.abs(targetTimeRef.current - video.currentTime) > 0.01) {
        seekTo(targetTimeRef.current);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        prevXRef.current = event.clientX;
        return;
      }

      const previousX = prevXRef.current;
      prevXRef.current = event.clientX;

      if (previousX === null) {
        return;
      }

      const delta = event.clientX - previousX;
      const deltaTime = (delta / window.innerWidth) * SENSITIVITY * duration;
      seekTo(video.currentTime + deltaTime);
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@mainframe.co');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover [object-position:70%_center]"
        muted
        playsInline
        preload="auto"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <header className="fixed inset-x-0 top-0 z-10">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
          <a href="#hero" className="flex items-center gap-3 text-black">
            <span
              className="text-[21px] tracking-tight sm:text-[26px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mainframe®
            </span>
            <span
              className="select-none text-[25px] sm:text-[30px]"
              style={{ letterSpacing: '-0.02em' }}
            >
              ✳︎
            </span>
          </a>

          <nav className="hidden items-center text-[23px] text-black md:flex">
            {navLinks.map((link, index) => (
              <span key={link}>
                <a href="#" className="transition-opacity hover:opacity-60">
                  {link}
                </a>
                {index < navLinks.length - 1 ? ', ' : ''}
              </span>
            ))}
          </nav>

          <a
            href="mailto:hello@mainframe.co"
            className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="relative z-10 flex flex-col gap-[5px] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={`h-[2px] w-6 bg-black transition duration-300 ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-black transition duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-black transition duration-300 ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 text-left backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black"
            onClick={() => setMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="mailto:hello@mainframe.co"
          className="text-[32px] font-medium text-black underline underline-offset-2"
          onClick={() => setMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>

      <main
        id="hero"
        className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0"
      >
        <div className="relative z-10 max-w-xl">
          <p
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#000',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </p>

          <p
            className="mb-5 min-h-[54px] text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {displayed}
            {!done ? (
              <span className="ml-[2px] inline-block h-[1.1em] w-[2px] animate-[blink_1s_step-end_infinite] align-middle bg-black" />
            ) : null}
          </p>

          <div
            className={`flex flex-wrap gap-y-1 transition-[opacity,transform] duration-[400ms] ease-out ${
              actionsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            {[
              'Pitch us an idea',
              'Come work here',
              'Send a brief hello',
              'See how we operate',
            ].map((label) => (
              <a
                key={label}
                href="mailto:hello@mainframe.co"
                className="mx-[0.2em] mb-[0.4em] inline-flex whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {label}
              </a>
            ))}

            <button
              type="button"
              onClick={handleCopyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  {copied ? 'copied' : 'hello@mainframe.co'}
                </span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
