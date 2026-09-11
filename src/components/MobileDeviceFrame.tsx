import type { ReactNode } from "react";

export function MobileDeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden bg-[#05070d] app-desktop-bg">
      <div
        className="app-phone-frame relative rounded-[42px] bg-gradient-to-b from-[#1a1d24] to-[#0d0f14] shadow-[0_0_0_2px_rgba(255,255,255,0.06),0_30px_60px_-15px_rgba(0,0,0,0.7),0_0_80px_-20px_rgba(70,90,200,0.25)] p-[10px]"
        style={{
          width: "390px",
          height: "min(844px, 92vh)",
        }}
      >
        <div className="app-phone-screen relative w-full h-full rounded-[32px] bg-[#0a0e1a] overflow-hidden">
          <div className="app-dynamic-island absolute top-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-50" />
          <div className="w-full h-full overflow-hidden relative">{children}</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .app-desktop-bg { background: #0a0e1a !important; }
          .app-phone-frame {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #0a0e1a !important;
          }
          .app-phone-screen { border-radius: 0 !important; }
          .app-dynamic-island { display: none !important; }
        }
      `}</style>
    </div>
  );
}
