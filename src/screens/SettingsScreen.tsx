import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Moon, Fingerprint, Mail, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { useToast } from "../components/Toast";
import { useTheme } from "../state/ThemeContext";

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-9 h-9 rounded-xl bg-[var(--royal)]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[var(--royal)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[var(--text-primary)]">{label}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="w-11 h-6 rounded-full flex-shrink-0 relative transition-colors outline-none"
        style={{ backgroundColor: checked ? "var(--royal)" : "var(--border-soft)" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? "22px" : "2px" }}
        />
      </button>
    </div>
  );
}

function LinkRow({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left active:bg-[var(--bg-subtle)]">
      <div className="w-9 h-9 rounded-xl bg-[var(--royal)]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[var(--royal)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-[var(--text-primary)]">{label}</div>
        <div className="text-[11px] text-[var(--text-muted)]">{description}</div>
      </div>
      <ChevronRight size={16} className="text-[var(--text-muted)] flex-shrink-0" />
    </button>
  );
}

export function SettingsScreen() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const { showToast } = useToast();

  const { isDark, setDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);

  if (section === "support") {
    return (
      <AppScreen>
        <MobileHeader title="Help & Support" showBack light />
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl shadow-sm overflow-hidden">
            <LinkRow
              icon={Phone}
              label="Call Support"
              description="+971 4 123 4567"
              onClick={() => showToast("This is a POC — calling is simulated")}
            />
            <div className="border-t border-[var(--border-soft)]" />
            <LinkRow
              icon={Mail}
              label="Email Support"
              description="support@yateemoptician.com"
              onClick={() => showToast("This is a POC — email is simulated")}
            />
            <div className="border-t border-[var(--border-soft)]" />
            <LinkRow
              icon={MessageCircle}
              label="Live Chat"
              description="Chat with our team"
              onClick={() => showToast("This is a POC — live chat is simulated")}
            />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed px-1">
            Support channels shown are placeholders for this proof-of-concept build.
          </p>
        </div>
      </AppScreen>
    );
  }

  if (section === "about") {
    return (
      <AppScreen>
        <MobileHeader title="About" showBack light />
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm space-y-2">
            <div className="text-[15px] font-bold text-[var(--text-primary)]">Yateem Optician — Smart Fit</div>
            <div className="text-[12px] text-[var(--text-secondary)]">Version 0.1 (POC Build)</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              This proof-of-concept demonstrates a camera-assisted frame-fitting measurement
              workflow. All AI/CV processing shown is simulated for demonstration purposes.
              Production accuracy requires validated computer-vision models, device
              calibration and reference measurements.
            </p>
          </div>
          <div className="text-center text-[10px] text-[var(--text-muted)] pb-2">
            © 2026 Yateem Optician. All rights reserved.
          </div>
        </div>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <MobileHeader title="Settings" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div>
          <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2 px-1">
            Preferences
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl shadow-sm overflow-hidden">
            <ToggleRow
              icon={Bell}
              label="Notifications"
              description="Alerts for new and pending fittings"
              checked={notifications}
              onChange={(v) => {
                setNotifications(v);
                showToast(v ? "Notifications enabled" : "Notifications disabled");
              }}
            />
            <div className="border-t border-[var(--border-soft)]" />
            <ToggleRow
              icon={Moon}
              label="Dark Mode"
              description="Switch to a darker color theme"
              checked={isDark}
              onChange={(v) => {
                setDarkMode(v);
                showToast(v ? "Dark mode enabled" : "Dark mode disabled");
              }}
            />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2 px-1">
            Security
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl shadow-sm overflow-hidden">
            <ToggleRow
              icon={Fingerprint}
              label="Biometric Login"
              description="Use fingerprint or face unlock"
              checked={biometric}
              onChange={(v) => {
                setBiometric(v);
                showToast(v ? "Biometric login enabled" : "Biometric login disabled");
              }}
            />
          </div>
        </div>

        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed px-1">
          Dark Mode is saved on this device. Other settings shown are POC placeholders and do
          not persist across sessions.
        </p>
      </div>
    </AppScreen>
  );
}
