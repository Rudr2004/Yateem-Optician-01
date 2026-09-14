import { useNavigate } from "react-router-dom";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { FacePortrait } from "../components/FacePortrait";
import { FACE_GLASSES, FACE_FRONT } from "../assets/faceImages";
import { useAppState } from "../state/AppStateContext";
import type { TintColor } from "../types";

// front-face.jpeg shows the customer already wearing real glasses, so the
// tint preview colors the actual lens areas of that photo rather than
// drawing a second frame outline on top of it (which used to visibly
// double up with the real frame). Ellipses measured pixel-precisely against
// the photo's object-cover crop in the 3:4 preview box, sitting just inside
// the real frame's rim so the black rim stays visible through the tint.
const LEFT_LENS = { cx: 27.5, cy: 48, rx: 12.5, ry: 11 };
const RIGHT_LENS = { cx: 67, cy: 47, rx: 16, ry: 11 };

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

          {/* Tints the customer's real glasses lenses in the photo, rather than
              drawing a second frame outline on top of the existing one. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: photoSrc ? "block" : "none" }}
          >
            <g fill={activeColor.hex} opacity={state.tint.opacity / 100} style={{ mixBlendMode: "multiply" }}>
              <ellipse cx={LEFT_LENS.cx} cy={LEFT_LENS.cy} rx={LEFT_LENS.rx} ry={LEFT_LENS.ry} mask="url(#lensFeather)" />
              <ellipse cx={RIGHT_LENS.cx} cy={RIGHT_LENS.cy} rx={RIGHT_LENS.rx} ry={RIGHT_LENS.ry} mask="url(#lensFeather)" />
            </g>
            <g fill="url(#lensSheen)">
              <ellipse cx={LEFT_LENS.cx} cy={LEFT_LENS.cy} rx={LEFT_LENS.rx} ry={LEFT_LENS.ry} mask="url(#lensFeather)" />
              <ellipse cx={RIGHT_LENS.cx} cy={RIGHT_LENS.cy} rx={RIGHT_LENS.rx} ry={RIGHT_LENS.ry} mask="url(#lensFeather)" />
            </g>
            <defs>
              <linearGradient id="lensSheen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.02" />
              </linearGradient>
              {/* Radial fade so the tint softens toward the lens edge instead of
                  ending in a hard geometric circle. Uses an ellipse (not a
                  rect) as the mask shape so the fade follows the lens's own
                  aspect ratio instead of being squashed by the bounding box. */}
              <radialGradient id="lensFeatherGradient">
                <stop offset="88%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="lensFeather" maskContentUnits="objectBoundingBox">
                <ellipse cx="0.5" cy="0.5" rx="0.5" ry="0.5" fill="url(#lensFeatherGradient)" />
              </mask>
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
