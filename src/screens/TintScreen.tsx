import { useNavigate } from "react-router-dom";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import type { TintColor } from "../types";

const TINT_COLORS: { key: TintColor; hex: string }[] = [
  { key: "Grey", hex: "#6b7280" },
  { key: "Brown", hex: "#8b5a2b" },
  { key: "Green", hex: "#3f7d4f" },
  { key: "Blue", hex: "#3b6ea5" },
  { key: "Rose", hex: "#c06a7f" },
];

const OPACITY_LEVELS: (25 | 50 | 70 | 80)[] = [25, 50, 70, 80];

export function TintScreen() {
  const navigate = useNavigate();
  const { state, setTintColor, setTintOpacity } = useAppState();
  const activeColor = TINT_COLORS.find((c) => c.key === state.tint.color)!;

  return (
    <AppScreen>
      <MobileHeader title="Tint & Virtual Try-On" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-b from-[#1c2333] to-[#0e1220] border border-white/10">
          <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="skin2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a3244" />
                <stop offset="100%" stopColor="#2b2636" />
              </linearGradient>
            </defs>
            <ellipse cx="150" cy="190" rx="82" ry="105" fill="url(#skin2)" />
            <path d="M70 150 Q70 60 150 55 Q230 60 230 150 Q230 110 150 100 Q70 110 70 150 Z" fill="#1a1520" />
            <ellipse cx="118" cy="180" rx="13" ry="7" fill="#e8e2ea" />
            <ellipse cx="182" cy="180" rx="13" ry="7" fill="#e8e2ea" />
            <circle cx="118" cy="180" r="4.5" fill="#2c1810" />
            <circle cx="182" cy="180" r="4.5" fill="#2c1810" />
            <path d="M104 165 Q118 159 132 164" stroke="#1a1520" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M168 164 Q182 159 196 165" stroke="#1a1520" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M150 180 L146 210 Q150 216 154 210 Z" fill="#231d2e" opacity="0.4" />
            <path d="M128 240 Q150 250 172 240" stroke="#5c3a3a" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Frame with tinted lenses */}
            <g stroke="#0a0e1a" strokeWidth="4">
              <rect
                x="90"
                y="165"
                rx="10"
                ry="10"
                width="60"
                height="34"
                fill={activeColor.hex}
                opacity={state.tint.opacity / 100}
              />
              <rect
                x="150"
                y="165"
                rx="10"
                ry="10"
                width="60"
                height="34"
                fill={activeColor.hex}
                opacity={state.tint.opacity / 100}
              />
              <path d="M90 178 L70 172" strokeLinecap="round" />
              <path d="M210 178 L230 172" strokeLinecap="round" />
            </g>
          </svg>
          <span className="absolute top-3 left-3 text-[9px] font-semibold text-slate-300 bg-black/40 px-2 py-1 rounded-full">
            Virtual preview
          </span>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 mb-2">Tint Color</div>
          <div className="flex gap-2.5">
            {TINT_COLORS.map((c) => (
              <button
                key={c.key}
                onClick={() => setTintColor(c.key)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: state.tint.color === c.key ? "#818cf8" : "transparent",
                  }}
                />
                <span
                  className={`text-[10px] ${
                    state.tint.color === c.key ? "text-indigo-300 font-semibold" : "text-slate-400"
                  }`}
                >
                  {c.key}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">Opacity</span>
            <span className="text-[12px] font-semibold text-white">{state.tint.opacity}%</span>
          </div>
          <input
            type="range"
            min={25}
            max={80}
            step={1}
            value={state.tint.opacity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              const nearest = OPACITY_LEVELS.reduce((a, b) =>
                Math.abs(b - val) < Math.abs(a - val) ? b : a
              );
              setTintOpacity(nearest);
            }}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between mt-1">
            {OPACITY_LEVELS.map((level) => (
              <span key={level} className="text-[10px] text-slate-500">
                {level}%
              </span>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed">
          Image processing / masking simulation. Potential production enhancement: AI/AR-based
          face and frame segmentation.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton onClick={() => navigate("/review")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
