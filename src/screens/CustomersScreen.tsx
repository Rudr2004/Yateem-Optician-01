import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { BottomNavigation } from "../components/BottomNavigation";
import { RECENT_FITTINGS } from "../mockData";
import { initialsOf, avatarColorFor } from "../utils/avatar";

// One row per customer, not per fitting — a customer can have multiple
// fitting records, so this dedupes RECENT_FITTINGS by customerId and shows
// their most recent visit.
function useCustomerDirectory() {
  return useMemo(() => {
    const byId = new Map<string, (typeof RECENT_FITTINGS)[number]>();
    for (const f of RECENT_FITTINGS) {
      if (!byId.has(f.customerId)) byId.set(f.customerId, f);
    }
    return Array.from(byId.values());
  }, []);
}

export function CustomersScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const customers = useCustomerDirectory();

  const filtered = customers.filter(
    (c) =>
      query.trim().length === 0 ||
      c.customerName.toLowerCase().includes(query.toLowerCase()) ||
      c.customerId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppScreen>
      <MobileHeader title="Customers" subtitle={`${customers.length} customers on file`} light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer name or ID..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl pl-10 pr-4 py-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--royal)]/40 shadow-sm"
          />
        </div>

        {filtered.map((c) => (
          <button
            key={c.customerId}
            onClick={() => navigate(`/measure/recent/${c.id}`)}
            className="w-full text-left flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm active:bg-[var(--bg-subtle)]"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-[14px] ${avatarColorFor(
                c.customerName
              )}`}
            >
              {initialsOf(c.customerName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                {c.customerName}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{c.customerId}</div>
              <div className="text-[12px] text-[var(--text-secondary)] mt-1">
                Last fitting: {c.frameName} · {c.date}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-[13px] text-[var(--text-muted)] py-10">
            No customers match your search.
          </div>
        )}
      </div>
      <BottomNavigation />
    </AppScreen>
  );
}
