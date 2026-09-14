import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import type { Customer } from "../types";

// Allows digits plus the punctuation real phone numbers use (leading +,
// spaces, hyphens) while blocking letters and other characters, and caps
// the number at 10 digits (excluding formatting characters).
const PHONE_CHARS = /^[0-9+\-\s]*$/;
const MAX_PHONE_DIGITS = 10;

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const isDate = type === "date";
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm transition-colors has-[:focus]:border-[var(--royal)] has-[:focus]:ring-1 has-[:focus]:ring-[var(--royal)]/25">
      <label className="block text-[11px] text-[var(--text-muted)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          if (type === "tel") {
            if (!PHONE_CHARS.test(next)) return;
            const digitCount = next.replace(/[^0-9]/g, "").length;
            if (digitCount > MAX_PHONE_DIGITS) return;
          }
          onChange(next);
        }}
        className={`w-full text-[15px] font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] placeholder:font-medium bg-transparent outline-none ${
          isDate ? "[color-scheme:light]" : ""
        }`}
      />
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
          <div className="text-[17px] font-bold">
            {customer.name ? (
              <span className="text-[var(--text-primary)]">{customer.name}</span>
            ) : (
              <span className="text-[var(--text-muted)]">New Customer</span>
            )}
          </div>
          <div className="text-[var(--text-muted)] text-[12px]">
            {customer.customerId || "No ID assigned yet"}
          </div>
        </div>

        <div className="space-y-3">
          <EditableField
            label="Customer Name"
            value={customer.name}
            onChange={setField("name")}
            placeholder="Enter customer name"
          />
          <EditableField
            label="Customer ID"
            value={customer.customerId}
            onChange={setField("customerId")}
            placeholder="Enter customer ID"
          />
          <EditableField
            label="Phone Number"
            value={customer.phone}
            onChange={setField("phone")}
            type="tel"
            placeholder="Enter phone number"
          />
          <EditableField
            label="Date of Birth"
            value={customer.dob}
            onChange={setField("dob")}
            type="date"
            placeholder="Enter date of birth"
          />
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton
          disabled={!customer.name.trim() || !customer.phone.trim()}
          onClick={() => navigate("/frame-selection")}
        >
          CONTINUE
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
