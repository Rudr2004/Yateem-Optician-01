import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { StatusBadge } from "../components/StatusBadge";
import { useAppState } from "../state/AppStateContext";
import type { MeasurementValue } from "../types";

function ValidationRow({
  m,
  onAccept,
  onReject,
  onEdit,
}: {
  m: MeasurementValue;
  onAccept: () => void;
  onReject: () => void;
  onEdit: (value: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const aiValue =
    m.right !== undefined ? `${m.right.toFixed(1)} / ${m.left?.toFixed(1)} mm` : `${m.single} ${m.unit}`;
  const techValue =
    m.technicianRight !== undefined
      ? `${m.technicianRight.toFixed(1)} / ${m.technicianLeft?.toFixed(1)} mm`
      : `${m.technicianSingle} ${m.unit}`;

  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-semibold text-white">{m.name}</span>
        {m.validation === "accepted" && <StatusBadge variant="ok">Accepted</StatusBadge>}
        {m.validation === "edited" && <StatusBadge variant="processing">Edited</StatusBadge>}
        {m.validation === "rejected" && <StatusBadge variant="review">Rejected</StatusBadge>}
        {m.validation === "pending" && <StatusBadge variant="pending">Pending</StatusBadge>}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] text-slate-400 mb-0.5">AI</div>
          <div className="text-[14px] font-semibold text-slate-200">{aiValue}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 mb-0.5">Technician</div>
          {editing ? (
            <input
              autoFocus
              type="number"
              defaultValue={m.technicianSingle ?? m.technicianRight}
              onBlur={(e) => {
                onEdit(parseFloat(e.target.value));
                setEditing(false);
              }}
              className="w-full bg-white/10 text-white text-[14px] font-semibold rounded-lg px-2 py-1 border border-indigo-400/40 outline-none"
            />
          ) : (
            <div className="text-[14px] font-semibold text-white">{techValue}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-2 active:bg-emerald-500/20"
        >
          <Check size={12} /> Accept
        </button>
        <button
          onClick={() => setEditing(true)}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-2 active:bg-indigo-500/20"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 active:bg-red-500/20"
        >
          <X size={12} /> Reject
        </button>
      </div>
    </div>
  );
}

export function MeasurementValidationScreen() {
  const navigate = useNavigate();
  const { state, updateMeasurement, acceptAllMeasurements } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Measurement Validation" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <p className="text-[12px] text-slate-400">AI Detected Measurements vs. Technician Review</p>

        {state.measurements.map((m) => (
          <ValidationRow
            key={m.key}
            m={m}
            onAccept={() => updateMeasurement(m.key, { validation: "accepted" })}
            onReject={() => updateMeasurement(m.key, { validation: "rejected" })}
            onEdit={(value) => {
              if (m.technicianSingle !== undefined) {
                updateMeasurement(m.key, { technicianSingle: value, validation: "edited" });
              } else {
                updateMeasurement(m.key, { technicianRight: value, validation: "edited" });
              }
            }}
          />
        ))}
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2">
        <SecondaryButton onClick={acceptAllMeasurements}>ACCEPT ALL</SecondaryButton>
        <PrimaryButton onClick={() => navigate("/lens")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
