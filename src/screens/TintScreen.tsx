import { useNavigate } from "react-router-dom";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { FacePortrait } from "../components/FacePortrait";
import { FACE_GLASSES, FACE_FRONT } from "../assets/faceImages";
import { useAppState } from "../state/AppStateContext";
import type { FrameShape, TintColor } from "../types";

// Pupil centers measured against the customer photo's object-cover crop
// in the 3:4 preview box (detected via pixel analysis, not eyeballed):
// left eye at 37.5%/49.2%, right eye at 63.8%/49.2%.
const LEFT_EYE = { cx: 112.5, cy: 197 };
const RIGHT_EYE = { cx: 191.4, cy: 197 };

function LensShape({ cx, cy, shape }: { cx: number; cy: number; shape: FrameShape }) {
  if (shape === "round") {
    return <circle cx={cx} cy={cy} r={34} />;
  }
  if (shape === "cat-eye") {
    const half = 42;
    return (
      <path
        d={`M${cx - half} ${cy + 12}
            Q${cx - half - 4} ${cy - 20} ${cx} ${cy - 26}
            Q${cx + half + 4} ${cy - 20} ${cx + half} ${cy + 12}
            Q${cx + half - 10} ${cy + 28} ${cx} ${cy + 26}
            Q${cx - half + 10} ${cy + 28} ${cx - half} ${cy + 12} Z`}
      />
    );
  }
  // rectangle
  return <rect x={cx - 40} y={cy - 29} width={80} height={58} rx={14} />;
}

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
  const photoSrc = FACE_GLASSES || FACE_FRONT;
  const frameShape: FrameShape = state.selectedFrame?.shape ?? "round";

  return (
    <AppScreen>
      <MobileHeader title="Tint & Virtual Try-On" subtitle="Step 7 of 7" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-[#0d131f] border border-[var(--border-soft)]">
          {photoSrc ? (
            <img src={photoSrc} alt="Customer preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <FacePortrait className="absolute inset-0 w-full h-full" />
          )}

          {/* Frame outline with tinted lenses, positioned over the eye area (calibrated to the customer photo) */}
          <svg
            viewBox="0 0 300 400"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: photoSrc ? "block" : "none" }}
          >
            <g stroke="#1a1a1a" strokeWidth="3.5" strokeLinejoin="round">
              <g fill={activeColor.hex} opacity={state.tint.opacity / 100}>
                <LensShape cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} shape={frameShape} />
                <LensShape cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} shape={frameShape} />
              </g>
              <path d="M158 193 Q152 187 146 193" fill="none" />
              <path d="M79 187 L55 177" strokeLinecap="round" />
              <path d="M225 187 L249 177" strokeLinecap="round" />
            </g>
            <g fill="url(#lensSheen)">
              <LensShape cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} shape={frameShape} />
              <LensShape cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} shape={frameShape} />
            </g>
            <defs>
              <linearGradient id="lensSheen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.03" />
              </linearGradient>
            </defs>
          </svg>

          {!photoSrc && (
            <>
              <div
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: "27%",
                  top: "40%",
                  width: "18%",
                  height: "13%",
                  backgroundColor: activeColor.hex,
                  opacity: state.tint.opacity / 100,
                  mixBlendMode: "multiply",
                  filter: "blur(1px)",
                }}
              />
              <div
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: "56%",
                  top: "40%",
                  width: "18%",
                  height: "13%",
                  backgroundColor: activeColor.hex,
                  opacity: state.tint.opacity / 100,
                  mixBlendMode: "multiply",
                  filter: "blur(1px)",
                }}
              />
            </>
          )}

          <span className="absolute top-3 left-3 text-[9px] font-semibold text-white bg-black/45 px-2 py-1 rounded-full">
            Virtual preview
          </span>
          {state.selectedFrame && (
            <span className="absolute top-3 right-3 text-[9px] font-semibold text-white bg-black/45 px-2 py-1 rounded-full">
              {state.selectedFrame.name}
            </span>
          )}
        </div>

        <div>
          <div className="text-[11px] text-[var(--text-muted)] mb-2">Tint Color</div>
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
                    borderColor: state.tint.color === c.key ? "var(--royal)" : "transparent",
                  }}
                />
                <span
                  className={`text-[10px] ${
                    state.tint.color === c.key
                      ? "text-[var(--royal)] font-semibold"
                      : "text-[var(--text-muted)]"
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
            <span className="text-[11px] text-[var(--text-muted)]">Opacity</span>
            <span className="text-[12px] font-semibold text-[var(--text-primary)]">
              {state.tint.opacity}%
            </span>
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
            className="w-full accent-[var(--royal)]"
          />
          <div className="flex justify-between mt-1">
            {OPACITY_LEVELS.map((level) => (
              <span key={level} className="text-[10px] text-[var(--text-muted)]">
                {level}%
              </span>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Image processing / masking simulation. Potential production enhancement: AI/AR-based
          face and frame segmentation.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/review")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
