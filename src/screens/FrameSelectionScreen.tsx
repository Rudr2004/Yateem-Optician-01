import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { StatusBadge } from "../components/StatusBadge";
import { FrameIllustration } from "../components/FrameIllustration";
import { useAppState } from "../state/AppStateContext";
import { MOCK_FRAMES } from "../mockData";
import { FRAME_IMAGES } from "../assets/frameImages";

const RIM_FILTERS = ["All", "Full Rim", "Semi Rimless"] as const;

export function FrameSelectionScreen() {
  const navigate = useNavigate();
  const { state, setFrame } = useAppState();
  const [query, setQuery] = useState("");
  const [rimFilter, setRimFilter] = useState<typeof RIM_FILTERS[number]>("All");

  const filteredFrames = useMemo(() => {
    return MOCK_FRAMES.filter((f) => {
      const matchesQuery =
        query.trim().length === 0 ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.frameCode.toLowerCase().includes(query.toLowerCase());
      const matchesRim = rimFilter === "All" || f.rimType === rimFilter;
      return matchesQuery && matchesRim;
    });
  }, [query, rimFilter]);

  return (
    <AppScreen>
      <MobileHeader title="Select Frame" subtitle="Step 2 of 7 · Frame catalogue" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search frame name or ID..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl pl-10 pr-4 py-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--royal)]/40 shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {RIM_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setRimFilter(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                rimFilter === f
                  ? "bg-[var(--navy)] border-[var(--navy)] text-white"
                  : "bg-[var(--bg-card)] border-[var(--border-soft)] text-[var(--text-secondary)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFrames.map((frame) => {
            const selected = state.selectedFrame?.id === frame.id;
            return (
              <button
                key={frame.id}
                onClick={() => setFrame(frame)}
                className={`w-full text-left bg-[var(--bg-card)] border rounded-2xl p-4 transition-colors shadow-sm ${
                  selected ? "border-[var(--royal)] ring-1 ring-[var(--royal)]/25" : "border-[var(--border-soft)]"
                }`}
              >
                <div className="w-full aspect-[16/8] rounded-xl bg-white flex items-center justify-center mb-3 p-3">
                  {FRAME_IMAGES[frame.id] ? (
                    <img
                      src={FRAME_IMAGES[frame.id]!}
                      alt={frame.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FrameIllustration
                      shape={frame.shape}
                      color={frame.color}
                      material={frame.material}
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="text-[15px] font-bold text-[var(--text-primary)]">{frame.name}</div>
                  {selected && <StatusBadge variant="ok">Selected</StatusBadge>}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mb-2">Frame ID: {frame.frameCode}</div>
                <div className="text-[12px] text-[var(--text-secondary)] mb-2.5">
                  {frame.rimType} · {frame.material}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["A", frame.frameA],
                    ["B", frame.frameB],
                    ["C / DBL", frame.dbl],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[var(--bg-subtle)] rounded-lg py-1.5 text-center">
                      <div className="text-[9px] text-[var(--text-muted)]">{label}</div>
                      <div className="text-[12px] font-bold text-[var(--text-primary)]">{val} mm</div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
          {filteredFrames.length === 0 && (
            <div className="text-center text-[13px] text-[var(--text-muted)] py-10">
              No frames match your search.
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton
          disabled={!state.selectedFrame}
          onClick={() => navigate("/measure/intro")}
        >
          CONTINUE TO MEASUREMENT
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
