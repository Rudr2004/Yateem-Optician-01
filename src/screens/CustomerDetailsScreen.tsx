import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";

export function CustomerDetailsScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const { customer } = state;

  const fields: { label: string; value: string }[] = [
    { label: "Customer Name", value: customer.name },
    { label: "Customer ID", value: customer.customerId },
    { label: "Phone Number", value: customer.phone },
    { label: "Date of Birth", value: customer.dob },
  ];

  return (
    <AppScreen>
      <MobileHeader title="Customer Details" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 animate-fade-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/20 border border-indigo-400/20 flex items-center justify-center mb-3">
            <User size={30} className="text-indigo-300" />
          </div>
          <div className="text-white text-[17px] font-semibold">{customer.name}</div>
          <div className="text-slate-400 text-[12px]">{customer.customerId}</div>
        </div>

        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
              <div className="text-[11px] text-slate-400 mb-1">{f.label}</div>
              <div className="text-[15px] font-medium text-white">{f.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton onClick={() => navigate("/frame-selection")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
