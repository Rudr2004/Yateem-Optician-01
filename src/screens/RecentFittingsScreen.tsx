import { useSearchParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { BottomNavigation } from "../components/BottomNavigation";
import { PrimaryButton } from "../components/Buttons";
import { StatusBadge } from "../components/StatusBadge";
import { RECENT_FITTINGS, type FittingStatus } from "../mockData";
import { initialsOf, avatarColorFor } from "../utils/avatar";

type Filter = "all" | "today" | FittingStatus;

const FILTER_META: Record<Filter, { title: string; subtitle: string }> = {
  all: { title: "Measurements", subtitle: "All recorded fittings" },
  today: { title: "Today's Measurements", subtitle: "Fittings recorded today" },
  completed: { title: "Completed Measurements", subtitle: "Fittings finished and confirmed" },
  pending: { title: "Pending Measurements", subtitle: "Fittings awaiting completion" },
};

export function RecentFittingsScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("status");
  const filter: Filter =
    filterParam === "today" || filterParam === "completed" || filterParam === "pending"
      ? filterParam
      : "all";
  // Only the bottom-nav "Measurements" tab reaches this screen with no
  // status param at all — every Home-screen drill-down (including "Recent
  // Measurements", which resolves to the same "all" filter) sets one
  // explicitly. Use that to show "Start New Measurement" only on the tab
  // root, not when arriving via a specific stat card.
  const isTabRoot = filterParam === null;

  const fittings = RECENT_FITTINGS.filter((f) => {
    if (filter === "today") return f.date === "Today";
    if (filter === "completed" || filter === "pending") return f.status === filter;
    return true;
  });
  const { title, subtitle } = FILTER_META[filter];

  return (
    <AppScreen>
      <MobileHeader title={title} subtitle={subtitle} showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        {isTabRoot && (
          <>
            <PrimaryButton icon={<Plus size={16} />} onClick={() => navigate("/customer")}>
              START NEW MEASUREMENT
            </PrimaryButton>

            <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide pt-1">
              Past Measurements
            </div>
          </>
        )}

        {fittings.map((f) => (
          <button
            key={f.id}
            onClick={() => navigate(`/measure/recent/${f.id}`)}
            className="w-full text-left flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm active:bg-[var(--bg-subtle)]"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-[13px] ${avatarColorFor(
                f.customerName
              )}`}
            >
              {initialsOf(f.customerName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                  {f.customerName}
                </span>
                <StatusBadge variant={f.status === "completed" ? "ok" : "pending"}>
                  {f.status === "completed" ? "Completed" : "Pending"}
                </StatusBadge>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{f.customerId}</div>
              <div className="text-[12px] text-[var(--text-secondary)] mt-1">
                {f.frameName} · {f.date}, {f.time}
              </div>
            </div>
          </button>
        ))}
        {fittings.length === 0 && (
          <div className="text-center text-[13px] text-[var(--text-muted)] py-10">
            No measurements found.
          </div>
        )}
      </div>
      <BottomNavigation />
    </AppScreen>
  );
}
