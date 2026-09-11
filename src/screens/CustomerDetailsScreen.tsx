import { useNavigate } from "react-router-dom";
import { User, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import type { Customer } from "../types";

function EditableField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
        {!editing && (
          <button
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
            className="w-6 h-6 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)]"
          >
            <Pencil size={11} className="text-[var(--text-secondary)]" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="flex-1 text-[15px] font-semibold text-[var(--text-primary)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--royal)]/30"
          />
          <button
            onClick={commit}
            className="w-8 h-8 rounded-full bg-[var(--royal)] flex items-center justify-center flex-shrink-0"
          >
            <Check size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <div className="text-[15px] font-semibold text-[var(--text-primary)]">{value}</div>
      )}
    </div>
  );
}

export function CustomerDetailsScreen() {
  const navigate = useNavigate();
  const { state, updateCustomer } = useAppState();
  const { customer } = state;

  const setField = (field: keyof Customer) => (value: string) => updateCustomer({ [field]: value });

  return (
    <AppScreen>
      <MobileHeader title="Customer Details" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 animate-fade-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--royal)]/20 to-[var(--accent)]/10 border border-[var(--royal)]/15 flex items-center justify-center mb-3">
            <User size={30} className="text-[var(--royal)]" />
          </div>
          <div className="text-[var(--text-primary)] text-[17px] font-bold">{customer.name}</div>
          <div className="text-[var(--text-muted)] text-[12px]">{customer.customerId}</div>
        </div>

        <div className="space-y-3">
          <EditableField label="Customer Name" value={customer.name} onChange={setField("name")} />
          <EditableField label="Customer ID" value={customer.customerId} onChange={setField("customerId")} />
          <EditableField label="Phone Number" value={customer.phone} onChange={setField("phone")} />
          <EditableField label="Date of Birth" value={customer.dob} onChange={setField("dob")} />
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/frame-selection")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
