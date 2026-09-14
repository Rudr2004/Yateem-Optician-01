import { useNavigate, useParams } from "react-router-dom";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { ResultCard } from "../components/ResultCard";
import { StatusBadge } from "../components/StatusBadge";
import { RECENT_FITTINGS, MOCK_FRAMES } from "../mockData";
import { initialsOf, avatarColorFor } from "../utils/avatar";

export function FittingDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fitting = RECENT_FITTINGS.find((f) => f.id === id);
  const frame = fitting ? MOCK_FRAMES.find((f) => f.name === fitting.frameName) : undefined;

  if (!fitting) {
    return (
      <AppScreen>
        <MobileHeader title="Fitting Not Found" showBack light />
        <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--text-muted)]">
          This fitting record could not be found.
        </div>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <MobileHeader title={fitting.customerName} subtitle={fitting.customerId} showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-[16px] ${avatarColorFor(
              fitting.customerName
            )}`}
          >
            {initialsOf(fitting.customerName)}
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-bold text-[var(--text-primary)]">{fitting.customerName}</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{fitting.customerId}</div>
          </div>
          <StatusBadge variant={fitting.status === "completed" ? "ok" : "pending"}>
            {fitting.status === "completed" ? "Completed" : "Pending"}
          </StatusBadge>
        </div>

        <ResultCard title="Fitting">
          <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-[var(--text-secondary)]">
            <span>
              Frame:{" "}
              <span className="text-[var(--text-primary)] font-medium">{fitting.frameName}</span>
            </span>
            <span>
              Date:{" "}
              <span className="text-[var(--text-primary)] font-medium">
                {fitting.date}, {fitting.time}
              </span>
            </span>
            {frame && (
              <>
                <span>
                  Rim type:{" "}
                  <span className="text-[var(--text-primary)] font-medium">{frame.rimType}</span>
                </span>
                <span>
                  Material:{" "}
                  <span className="text-[var(--text-primary)] font-medium">{frame.material}</span>
                </span>
              </>
            )}
          </div>
        </ResultCard>

        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Sample fitting record for demonstration purposes. Full measurement data is only
          available for the fitting currently in progress.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate(-1)}>BACK TO LIST</PrimaryButton>
      </div>
    </AppScreen>
  );
}
