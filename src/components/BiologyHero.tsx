import React from "react";

/**
 * Duolingo-style hero with:
 * - Animated cell mascot (waving hand + wink)
 * - Floating biology icons (DNA, microscope, petri, leaf, molecule, heart, virus)
 * - CTA buttons on the right
 * TailwindCSS only. No external assets.
 */
export default function BiologyHero({
  onGetStarted,
  onHaveAccount,
}: {
  onGetStarted?: () => void;
  onHaveAccount?: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* 👇 Animations for hand & wink */}
      <style>{`
        .svg-anim [class*="anim-"] { transform-box: fill-box; }
        .anim-hand {
          transform-origin: 215px 148px; /* shoulder of right arm */
          animation: wave 2.4s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          65%, 75% { transform: rotate(-18deg); }
          70%, 80% { transform: rotate(14deg); }
        }
        .anim-wink {
          transform-origin: center;
          animation: wink 2.4s ease-in-out infinite;
        }
        @keyframes wink {
          0%, 86%, 100% { transform: scaleY(1); }
          90%, 94% { transform: scaleY(0.1); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(4px) translateY(-6px); }
          50% { transform: translateX(-2px) translateY(-8px); }
          75% { transform: translateX(-4px) translateY(-4px); }
        }
        @keyframes pulseShadow {
          0%, 100% { box-shadow: 0 10px 25px rgba(13,148,136,0.3); }
          50% { box-shadow: 0 15px 35px rgba(13,148,136,0.5); }
        }
        .animate-bob { animation: bob 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-drift { animation: drift 6s ease-in-out infinite; }
        .animate-pulseShadow { animation: pulseShadow 2s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100/40" />
      <div className="absolute -z-10 right-[-10%] top-[10%] w-[42rem] h-[42rem] rounded-full blur-3xl opacity-50 bg-gradient-to-br from-teal-200 to-cyan-200" />
      <div className="absolute -z-10 left-[-12%] bottom-[-10%] w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-cyan-200 to-teal-200" />

      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: Mascot + icons */}
          <div className="relative h-[380px] sm:h-[420px] lg:h-[460px]">
            {/* ambient circles */}
            <div className="absolute left-[8%] top-[18%] w-24 h-24 rounded-full bg-white/30 blur-xl" />
            <div className="absolute left-[42%] bottom-[10%] w-28 h-28 rounded-full bg-white/25 blur-xl" />
            <div className="absolute right-[6%] top-[8%] w-20 h-20 rounded-full bg-white/20 blur-xl" />

            {/* Mascot */}
            <div className="absolute left-[18%] top-[34%] -translate-x-1/2 -translate-y-1/2 animate-bob">
              <CellMascot className="w-[240px] sm:w-[280px] drop-shadow-md" />
              <div className="mx-auto mt-2 h-4 w-28 rounded-full bg-teal-900/5 blur-[1px]" />
            </div>

            {/* Floating icons */}
            <div className="absolute left-[6%] top-[8%] animate-drift">
              <MicroscopeIcon className="w-20" />
            </div>
            <div className="absolute left-[44%] top-[2%] animate-float">
              <DNAIcon className="w-16" />
            </div>
            <div className="absolute right-[10%] top-[26%] animate-drift">
              <PetriIcon className="w-20" />
            </div>
            <div className="absolute left-[2%] bottom-[16%] animate-float">
              <MoleculeIcon className="w-16" />
            </div>
            <div className="absolute right-[18%] bottom-[12%] animate-drift">
              <VirusIcon className="w-16" />
            </div>
            <div className="absolute right-[32%] top-[40%] animate-float">
              <HeartIcon className="w-16" />
            </div>
            <div className="absolute left-[28%] top-[6%] animate-drift">
              <LeafIcon className="w-16" />
            </div>
          </div>

          {/* RIGHT: Headline + CTAs */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800">
              Learn Biology
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                the Fun Way
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
              A friendly, visual path to cells, DNA, microbes, molecules, and more.
              Bite-sized lessons, clear goals, and delightful progress.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center px-7 py-3 rounded-2xl font-semibold text-white shadow-lg animate-pulseShadow"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(13,148,136), rgb(34,197,194))",
                }}
              >
                GET STARTED
              </button>
              <button
                onClick={onHaveAccount}
                className="inline-flex items-center justify-center px-7 py-3 rounded-2xl font-semibold border border-slate-200 bg-white text-slate-800 shadow"
              >
                I ALREADY HAVE AN ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mascot (with waving hand + wink) ---------------- */

function CellMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 260"
      className={`svg-anim ${className}`}
      role="img"
      aria-label="Friendly cartoon cell"
    >
      {/* body */}
      <defs>
        <radialGradient id="cellGlow" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
      </defs>
      <circle cx="130" cy="120" r="95" fill="url(#cellGlow)" />
      <circle cx="130" cy="120" r="95" fill="#16a34a" opacity="0.08" />

      {/* patches */}
      <ellipse cx="95" cy="150" rx="16" ry="10" fill="#34d399" />
      <circle cx="190" cy="130" r="9" fill="#34d399" />
      <circle cx="75" cy="95" r="8" fill="#86efac" />
      <path
        d="M165 160c18 0 28 12 28 12"
        stroke="#10b981"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        opacity=".7"
      />

      {/* Left eye (static) */}
      <circle cx="100" cy="115" r="20" fill="#fff" />
      <circle cx="105" cy="120" r="10" fill="#1f2937" />
      <circle cx="96" cy="112" r="6" fill="#fff" />

      {/* Right eye (wink) */}
      <g className="anim-wink">
        <circle cx="160" cy="115" r="20" fill="#fff" />
        <circle cx="165" cy="120" r="10" fill="#1f2937" />
        <circle cx="156" cy="112" r="6" fill="#fff" />
      </g>

      {/* mouth */}
      <path
        d="M118 155c12 10 28 10 40 0"
        stroke="#ef4444"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="87" cy="142" r="8" fill="#fca5a5" opacity=".9" />
      <circle cx="173" cy="142" r="8" fill="#fca5a5" opacity=".9" />

      {/* feet */}
      <ellipse cx="75" cy="188" rx="12" ry="22" fill="#16a34a" />
      <ellipse cx="185" cy="188" rx="12" ry="22" fill="#16a34a" />

      {/* arms */}
      <ellipse cx="45" cy="148" rx="12" ry="22" fill="#22c55e" />
      <g className="anim-hand">
        <ellipse cx="215" cy="148" rx="12" ry="22" fill="#22c55e" />
      </g>
    </svg>
  );
}

/* ---------------- Icons ---------------- */

function DNAIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 84" className={className} aria-label="DNA">
      <path
        d="M14,70 C30,56 54,52 70,36"
        stroke="#2563eb"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14,54 C30,40 54,36 70,20"
        stroke="#fb7185"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {[...Array(6)].map((_, i) => {
        const x = 20 + i * 10;
        return (
          <line
            key={i}
            x1={x}
            y1={40}
            x2={x}
            y2={60}
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MicroscopeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-label="Microscope">
      <rect x="10" y="70" width="60" height="12" rx="6" fill="#facc15" />
      <rect x="30" y="46" width="12" height="22" rx="6" fill="#0ea5a4" />
      <rect x="34" y="22" width="30" height="10" rx="5" fill="#38bdf8" />
      <circle cx="70" cy="26" r="8" fill="#0ea5a4" />
      <rect x="62" y="32" width="12" height="24" rx="6" fill="#0ea5a4" />
      <path
        d="M32 64 Q 58 52, 82 70"
        stroke="#0ea5a4"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PetriIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-label="Petri dish">
      <ellipse
        cx="48"
        cy="48"
        rx="36"
        ry="20"
        fill="#bae6fd"
        stroke="#06b6d4"
        strokeWidth="6"
      />
      <circle cx="34" cy="46" r="5" fill="#06b6d4" opacity=".5" />
      <circle cx="58" cy="50" r="6" fill="#06b6d4" opacity=".35" />
      <circle cx="46" cy="56" r="4" fill="#06b6d4" opacity=".4" />
    </svg>
  );
}

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-label="Leaf">
      <path d="M10 56 C10 28 38 10 70 10 C70 42 52 70 24 70 Z" fill="#22c55e" />
      <path
        d="M22 64 C40 46 54 34 68 22"
        stroke="#16a34a"
        strokeWidth="6"
        fill="none"
      />
    </svg>
  );
}

function MoleculeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-label="Molecule">
      <circle cx="16" cy="40" r="8" fill="#3b82f6" />
      <circle cx="40" cy="20" r="8" fill="#f97316" />
      <circle cx="64" cy="40" r="8" fill="#a855f7" />
      <circle cx="40" cy="64" r="8" fill="#22c55e" />
      <line x1="16" y1="40" x2="40" y2="20" stroke="#64748b" strokeWidth="4" />
      <line x1="40" y1="20" x2="64" y2="40" stroke="#64748b" strokeWidth="4" />
      <line x1="16" y1="40" x2="40" y2="64" stroke="#64748b" strokeWidth="4" />
      <line x1="40" y1="64" x2="64" y2="40" stroke="#64748b" strokeWidth="4" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-label="Heart">
      <path
        d="M40 70 C14 50 8 42 8 30 C8 20 16 16 24 16 C32 16 36 20 40 24 C44 20 48 16 56 16 C64 16 72 20 72 30 C72 42 66 50 40 70 Z"
        fill="#ef4444"
      />
    </svg>
  );
}

function VirusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-label="Virus">
      <circle cx="40" cy="40" r="14" fill="#22c55e" />
      {[...Array(10)].map((_, i) => {
        const a = (i * Math.PI * 2) / 10;
        const x1 = 40 + Math.cos(a) * 14;
        const y1 = 40 + Math.sin(a) * 14;
        const x2 = 40 + Math.cos(a) * 22;
        const y2 = 40 + Math.sin(a) * 22;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="40" cy="40" r="6" fill="#ffffff" opacity=".35" />
    </svg>
  );
}
