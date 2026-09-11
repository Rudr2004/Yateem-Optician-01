import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Calculator } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import { LENS_INDEX_OPTIONS } from "../mockData";

function NumberField({
  label,
  value,
  onChange,
  step = 0.25,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="text-[11px] text-slate-400 mb-1">{label}</div>
      <div className="flex items-center bg-white/[0.04] border border-white/8 rounded-xl overflow-hidden">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 bg-transparent text-white text-[14px] font-semibold px-3 py-2.5 outline-none"
        />
        {unit && <span className="text-[11px] text-slate-500 pr-3">{unit}</span>}
      </div>
    </div>
  );
}

export function ThicknessScreen() {
  const navigate = useNavigate();
  const { state, setThicknessInputs, computeThicknessEstimate } = useAppState();
  const inputs = state.thicknessInputs;

  useEffect(() => {
    computeThicknessEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.sphere, inputs.cylinder, inputs.axis, inputs.frameWidth, inputs.frameHeight, inputs.dbl, inputs.lensIndex]);

  return (
    <AppScreen>
      <MobileHeader title="Lens Thickness Estimator" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2">
          <Calculator size={14} className="text-slate-400" />
          <span className="text-[11px] text-slate-400 font-medium">Rule / Formula-Based Calculation</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Sphere" value={inputs.sphere} onChange={(v) => setThicknessInputs({ sphere: v })} unit="D" />
          <NumberField label="Cylinder" value={inputs.cylinder} onChange={(v) => setThicknessInputs({ cylinder: v })} unit="D" />
          <NumberField label="Axis" value={inputs.axis} onChange={(v) => setThicknessInputs({ axis: v })} step={1} unit="°" />
          <NumberField label="Frame Width" value={inputs.frameWidth} onChange={(v) => setThicknessInputs({ frameWidth: v })} step={1} unit="mm" />
          <NumberField label="Frame Height" value={inputs.frameHeight} onChange={(v) => setThicknessInputs({ frameHeight: v })} step={1} unit="mm" />
          <NumberField label="DBL" value={inputs.dbl} onChange={(v) => setThicknessInputs({ dbl: v })} step={1} unit="mm" />
        </div>

        <div>
          <div className="text-[11px] text-slate-400 mb-2">Lens Index</div>
          <div className="flex gap-2">
            {LENS_INDEX_OPTIONS.map((idx) => (
              <button
                key={idx}
                onClick={() => setThicknessInputs({ lensIndex: idx })}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border ${
                  inputs.lensIndex === idx
                    ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-200"
                    : "bg-white/[0.04] border-white/8 text-slate-300"
                }`}
              >
                {idx}
              </button>
            ))}
          </div>
        </div>

        {state.thicknessEstimate && (
          <div className="bg-gradient-to-br from-indigo-600/15 to-[#0d1120] border border-indigo-500/20 rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-slate-400">Est. Center Thickness</div>
                <div className="text-[20px] font-bold text-white">
                  {state.thicknessEstimate.centerThickness.toFixed(1)} mm
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Est. Edge Thickness</div>
                <div className="text-[20px] font-bold text-white">
                  {state.thicknessEstimate.edgeThickness.toFixed(1)} mm
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] text-slate-400">Recommendation</div>
              <div className="text-[14px] font-semibold text-indigo-300">
                {state.thicknessEstimate.recommendedIndex} Index
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-500 leading-relaxed">
          Calculated using optical estimation rules. Estimate only. Final thickness is
          determined by laboratory calculations.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton onClick={() => navigate("/tint")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
