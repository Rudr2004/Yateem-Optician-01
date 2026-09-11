import { useNavigate } from "react-router-dom";
import { FileDown, Share2, Info } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import { useToast } from "../components/Toast";

export function ReportScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const { showToast } = useToast();

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <AppScreen>
      <MobileHeader title="Measurement Report" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4">
          <div className="text-center border-b border-slate-200 pb-3">
            <div className="text-[10px] tracking-[0.2em] text-indigo-600 font-semibold uppercase">
              Yateem Optician
            </div>
            <div className="text-[15px] font-bold">Smart Fit</div>
            <div className="text-[11px] text-slate-500 mt-1">Frame Fitting Measurement Report</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <div className="text-slate-400">Customer</div>
              <div className="font-semibold">{state.customer.name}</div>
            </div>
            <div>
              <div className="text-slate-400">Date</div>
              <div className="font-semibold">{today}</div>
            </div>
            <div>
              <div className="text-slate-400">Frame</div>
              <div className="font-semibold">{state.selectedFrame?.name}</div>
            </div>
            <div>
              <div className="text-slate-400">Measurement ID</div>
              <div className="font-semibold">{state.measurementId}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] text-center border-y border-slate-200 py-2">
            <div>
              <div className="text-slate-400">Frame A</div>
              <div className="font-bold">{state.selectedFrame?.frameA} mm</div>
            </div>
            <div>
              <div className="text-slate-400">Frame B</div>
              <div className="font-bold">{state.selectedFrame?.frameB} mm</div>
            </div>
            <div>
              <div className="text-slate-400">DBL</div>
              <div className="font-bold">{state.selectedFrame?.dbl} mm</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Measurements</div>
            <div className="grid grid-cols-2 gap-y-1 text-[10px]">
              {state.measurements.map((m) => (
                <span key={m.key}>
                  {m.name}:{" "}
                  <span className="font-semibold">
                    {m.right !== undefined ? `${m.right}/${m.left}` : m.single}
                    {m.unit}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-200 pt-2">
            <div>
              <div className="text-slate-400">Lens</div>
              <div className="font-semibold">{state.lensType}</div>
            </div>
            <div>
              <div className="text-slate-400">Coatings</div>
              <div className="font-semibold">{state.coatings.join(", ") || "None"}</div>
            </div>
            <div>
              <div className="text-slate-400">Thickness</div>
              <div className="font-semibold">
                {state.thicknessEstimate?.centerThickness.toFixed(1)}mm center /{" "}
                {state.thicknessEstimate?.edgeThickness.toFixed(1)}mm edge
              </div>
            </div>
            <div>
              <div className="text-slate-400">Tint</div>
              <div className="font-semibold">
                {state.tint.color} — {state.tint.opacity}%
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg p-2">
            <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[9px] text-amber-800 leading-relaxed">
              Refraction / prescription data is entered separately and is not measured by this
              application.
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2">
        <SecondaryButton
          icon={<FileDown size={16} />}
          onClick={() => showToast("PDF saved successfully")}
        >
          SAVE PDF
        </SecondaryButton>
        <PrimaryButton icon={<Share2 size={16} />} onClick={() => navigate("/share")}>
          SHARE REPORT
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
