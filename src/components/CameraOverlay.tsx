interface CameraOverlayProps {
  scanning?: boolean;
  frameDetected?: boolean;
  pupilsDetected?: boolean;
}

export function CameraOverlay({ scanning, frameDetected = true, pupilsDetected = true }: CameraOverlayProps) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1c2333] to-[#0e1220] border border-white/10">
      {/* Mock face illustration */}
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3244" />
            <stop offset="100%" stopColor="#2b2636" />
          </linearGradient>
        </defs>
        {/* face */}
        <ellipse cx="150" cy="190" rx="82" ry="105" fill="url(#skin)" />
        {/* hair */}
        <path d="M70 150 Q70 60 150 55 Q230 60 230 150 Q230 110 150 100 Q70 110 70 150 Z" fill="#1a1520" />
        {/* eyes */}
        <ellipse cx="118" cy="180" rx="13" ry="7" fill="#e8e2ea" />
        <ellipse cx="182" cy="180" rx="13" ry="7" fill="#e8e2ea" />
        <circle cx="118" cy="180" r="4.5" fill="#2c1810" />
        <circle cx="182" cy="180" r="4.5" fill="#2c1810" />
        {/* eyebrows */}
        <path d="M104 165 Q118 159 132 164" stroke="#1a1520" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M168 164 Q182 159 196 165" stroke="#1a1520" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M150 180 L146 210 Q150 216 154 210 Z" fill="#231d2e" opacity="0.4" />
        {/* mouth */}
        <path d="M128 240 Q150 250 172 240" stroke="#5c3a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* frame */}
        {frameDetected && (
          <g stroke="#0a0e1a" strokeWidth="4" fill="rgba(20,20,30,0.25)">
            <rect x="90" y="165" rx="10" ry="10" width="60" height="34" />
            <rect x="150" y="165" rx="10" ry="10" width="60" height="34" />
            <line x1="150" y1="180" x2="150" y2="180" stroke="#0a0e1a" strokeWidth="4" />
            <path d="M150 176 Q150 180 150 184" stroke="#0a0e1a" strokeWidth="4" />
            <path d="M90 178 L70 172" stroke="#0a0e1a" strokeWidth="4" strokeLinecap="round" />
            <path d="M210 178 L230 172" stroke="#0a0e1a" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {/* Face bounding box */}
      <div
        className="absolute rounded-2xl border-2 border-emerald-400/70"
        style={{ left: "18%", top: "15%", width: "64%", height: "62%" }}
      >
        <span className="absolute -top-5 left-0 text-[9px] font-semibold text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">
          FACE
        </span>
      </div>

      {/* Frame bounding box */}
      {frameDetected && (
        <div
          className="absolute rounded-lg border-2 border-indigo-400/80"
          style={{ left: "27%", top: "40%", width: "46%", height: "12%" }}
        >
          <span className="absolute -bottom-5 left-0 text-[9px] font-semibold text-indigo-300 bg-black/40 px-1.5 py-0.5 rounded">
            FRAME
          </span>
        </div>
      )}

      {/* Pupil markers */}
      {pupilsDetected && (
        <>
          <div
            className="absolute w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.6)]"
            style={{ left: "38.5%", top: "44%" }}
          />
          <div
            className="absolute w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.6)]"
            style={{ left: "59.5%", top: "44%" }}
          />
        </>
      )}

      {/* Center alignment line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15" />
      {/* Horizontal reference line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

      {/* Scan line animation */}
      {scanning && (
        <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden">
          <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-indigo-400/25 to-transparent animate-scanline" />
        </div>
      )}

      {/* Corner brackets */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-5 h-5 border-indigo-300/50 ${
            i === 0
              ? "border-t-2 border-l-2 rounded-tl-lg"
              : i === 1
              ? "border-t-2 border-r-2 rounded-tr-lg"
              : i === 2
              ? "border-b-2 border-l-2 rounded-bl-lg"
              : "border-b-2 border-r-2 rounded-br-lg"
          }`}
        />
      ))}
    </div>
  );
}
