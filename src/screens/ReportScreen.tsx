import { useNavigate } from "react-router-dom";
import { FileDown, Share2, Info, CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import { useToast } from "../components/Toast";

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[12px] font-semibold text-slate-800 text-right">{value}</span>
    </div>
  );
}

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
      <MobileHeader title="Measurement Report" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-white text-slate-900 rounded-2xl shadow-[0_4px_20px_-6px_rgba(15,23,42,0.15)] overflow-hidden">
          {/* Letterhead */}
          <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy-deep)] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-[12px]">YO</span>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.18em] text-blue-200 font-semibold uppercase">
                Yateem Optician
              </div>
              <div className="text-[15px] font-bold text-white leading-tight">Smart Fit</div>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div className="text-center">
              <div className="text-[13px] font-bold text-slate-800">Frame Fitting Measurement Report</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Measurement ID: {state.measurementId}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3">
              <div>
                <div className="text-[10px] text-slate-400">Customer</div>
                <div className="text-[13px] font-bold text-slate-800">{state.customer.name}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Date</div>
                <div className="text-[13px] font-bold text-slate-800">{today}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Frame</div>
                <div className="text-[13px] font-bold text-slate-800">{state.selectedFrame?.name}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Frame ID</div>
                <div className="text-[13px] font-bold text-slate-800">{state.selectedFrame?.frameCode}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Frame A", state.selectedFrame?.frameA],
                ["Frame B", state.selectedFrame?.frameB],
                ["DBL", state.selectedFrame?.dbl],
              ].map(([label, val]) => (
                <div key={label} className="bg-blue-50 rounded-lg py-2">
                  <div className="text-[9px] text-[var(--royal)]/70 font-medium">{label}</div>
                  <div className="text-[13px] font-bold text-[var(--navy)]">{val} mm</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Measurements
              </div>
              <div className="divide-y divide-slate-100">
                {state.measurements.map((m) => (
                  <ReportRow
                    key={m.key}
                    label={m.name}
                    value={
                      m.right !== undefined
                        ? `${m.right.toFixed(1)} / ${m.left?.toFixed(1)} ${m.unit}`
                        : `${m.single} ${m.unit}`
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Lens Specification
              </div>
              <div className="divide-y divide-slate-100">
                <ReportRow label="Lens Type" value={state.lensType ?? "—"} />
                <ReportRow label="Coatings" value={state.coatings.join(", ") || "None"} />
                <ReportRow
                  label="Thickness"
                  value={`${state.thicknessEstimate?.centerThickness.toFixed(1)}mm center / ${state.thicknessEstimate?.edgeThickness.toFixed(1)}mm edge`}
                />
                <ReportRow label="Tint" value={`${state.tint.color} — ${state.tint.opacity}%`} />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[var(--success-bg)] rounded-lg px-3 py-2.5">
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Ready for Laboratory
              </span>
              <span className="text-[12px] font-bold text-emerald-700">{state.aiConfidence}% confidence</span>
            </div>

            <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              <Info size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[9px] text-amber-800 leading-relaxed">
                Refraction / prescription data is entered separately and is not measured by this
                application.
              </p>
            </div>

            <div className="text-center text-[9px] text-slate-400 pt-1">
              Generated by Yateem Optician Smart Fit · POC simulation
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2 bg-[var(--bg-app)]">
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
