import { useCallback, useRef } from "react";
import { Move, MoveHorizontal } from "lucide-react";

interface DraggableHandleProps {
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
  color?: string;
  /** Renders the visible grab-handle at this y% instead of the data point's
   * own y%, with a connecting line drawn between them (handle stays under
   * the data point on the x-axis). Drag deltas still apply to (x, y). */
  handleOffsetY?: number;
  size?: number;
  /** Damps how much the point moves per pixel of physical drag distance
   * (1 = full 1:1 movement, 0.4 = requires ~2.5x more drag for the same
   * change). Keeps fine mm-level adjustments controllable on touch, where
   * small accidental movements shouldn't cause large measurement swings. */
  sensitivity?: number;
  /** Icon shown inside the handle: "move" (default, 4-way) or "horizontal"
   * (left-right arrows, for handles that only move along the x-axis). */
  icon?: "move" | "horizontal";
}

export function DraggableHandle({
  x,
  y,
  onChange,
  containerRef,
  color = "#fbbf24",
  handleOffsetY,
  size = 36,
  sensitivity = 1,
  icon = "move",
}: DraggableHandleProps) {
  const draggingRef = useRef(false);
  const lastPointRef = useRef({ clientX: 0, clientY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    lastPointRef.current = { clientX: e.clientX, clientY: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dxPct = ((e.clientX - lastPointRef.current.clientX) / rect.width) * 100 * sensitivity;
      const dyPct = ((e.clientY - lastPointRef.current.clientY) / rect.height) * 100 * sensitivity;
      lastPointRef.current = { clientX: e.clientX, clientY: e.clientY };
      const newX = Math.min(100, Math.max(0, x + dxPct));
      const newY = Math.min(100, Math.max(0, y + dyPct));
      onChange(newX, newY);
    },
    [containerRef, onChange, x, y, sensitivity]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleY = handleOffsetY ?? y;

  return (
    <>
      {handleOffsetY !== undefined && (
        <div
          className="absolute w-px bg-white/50 pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${Math.min(y, handleY)}%`,
            height: `${Math.abs(handleY - y)}%`,
          }}
        />
      )}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing z-20"
        style={{ left: `${x}%`, top: `${handleY}%` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="rounded-full bg-white shadow-lg flex items-center justify-center border-2"
          style={{ borderColor: color, width: size, height: size }}
        >
          {icon === "horizontal" ? (
            <MoveHorizontal size={Math.round(size * 0.45)} style={{ color }} />
          ) : (
            <Move size={Math.round(size * 0.4)} style={{ color }} />
          )}
        </div>
      </div>
    </>
  );
}
