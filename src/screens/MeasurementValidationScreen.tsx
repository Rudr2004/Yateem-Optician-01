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
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">{m.name}</span>
        {m.validation === "accepted" && <StatusBadge variant="ok">Accepted</StatusBadge>}
        {m.validation === "edited" && <StatusBadge variant="processing">Edited</StatusBadge>}
        {m.validation === "rejected" && <StatusBadge variant="review">Rejected</StatusBadge>}
        {m.validation === "pending" && <StatusBadge variant="pending">Pending</StatusBadge>}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] text-[var(--text-muted)] mb-0.5">AI</div>
          <div className="text-[14px] font-semibold text-[var(--text-secondary)]">{aiValue}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Technician</div>
          {editing ? (
            <input
              autoFocus
              type="number"
              defaultValue={m.technicianSingle ?? m.technicianRight}
              onBlur={(e) => {
                onEdit(parseFloat(e.target.value));
                setEditing(false);
              }}
              className="w-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-[14px] font-semibold rounded-lg px-2 py-1 border border-[var(--royal)]/40 outline-none"
            />
          ) : (
            <div className="text-[14px] font-semibold text-[var(--text-primary)]">{techValue}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-[var(--success)] bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-lg py-2 active:opacity-80"
        >
          <Check size={12} /> Accept
        </button>
        <button
          onClick={() => setEditing(true)}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-[var(--royal)] bg-blue-50 border border-[var(--royal)]/20 rounded-lg py-2 active:opacity-80"
        >
          <Pencil size={12} /> Edit
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-[var(--danger)] bg-[var(--danger-bg)] border border-[var(--danger)]/20 rounded-lg py-2 active:opacity-80"
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
      <MobileHeader title="Measurement Validation" subtitle="Step 6 of 7" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <p className="text-[12px] text-[var(--text-secondary)]">
          AI Detected Measurements vs. Technician Review
        </p>

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
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2 bg-[var(--bg-app)]">
        <SecondaryButton onClick={acceptAllMeasurements}>ACCEPT ALL</SecondaryButton>
        <PrimaryButton onClick={() => navigate("/lens")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
