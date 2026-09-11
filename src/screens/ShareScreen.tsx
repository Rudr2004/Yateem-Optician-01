import { useNavigate } from "react-router-dom";
import { Mail, MessageCircle, Printer, FileDown, CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useToast } from "../components/Toast";

const SHARE_OPTIONS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "print", label: "Print", icon: Printer },
  { key: "pdf", label: "Save PDF", icon: FileDown },
];

export function ShareScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <AppScreen>
      <MobileHeader title="Share Report" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-[var(--success)] flex-shrink-0" />
          <div>
            <div className="text-[13px] font-bold text-[var(--success)]">Report Ready</div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Measurement report prepared successfully.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SHARE_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => showToast(`${label} sent successfully`)}
              className="flex flex-col items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 active:bg-[var(--bg-subtle)] shadow-sm"
            >
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon size={19} className="text-[var(--royal)]" />
              </div>
              <span className="text-[12px] font-semibold text-[var(--text-primary)]">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/success")}>DONE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
