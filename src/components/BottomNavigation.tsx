import { Home, Users, Ruler, MoreHorizontal } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home, path: "/" },
  { key: "customers", label: "Customers", icon: Users, path: "/customers" },
  { key: "measurements", label: "Measurements", icon: Ruler, path: "/measure/recent" },
  { key: "more", label: "More", icon: MoreHorizontal, path: "/more" },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex-shrink-0 border-t border-[var(--border-soft)] bg-[var(--bg-card)] px-2 pt-2 pb-[max(10px,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl active:bg-[var(--bg-subtle)]"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "text-[var(--royal)]" : "text-[var(--text-muted)]"}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-[var(--royal)]" : "text-[var(--text-muted)]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
