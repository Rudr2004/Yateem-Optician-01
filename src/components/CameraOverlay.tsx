import { FacePortrait } from "./FacePortrait";
import { FACE_FRONT } from "../assets/faceImages";

interface CameraOverlayProps {
  scanning?: boolean;
  frameDetected?: boolean;
  pupilsDetected?: boolean;
  faceSrc?: string | null;
}

// Landmark positions expressed as % of the container. Two calibrations:
// one for the real photo (measured against its object-cover crop in the
// 3:4 preview box) and one for the illustrated FacePortrait fallback.
const PHOTO_LANDMARKS = {
  leftPupil: { x: 37.5, y: 49.2 },
  rightPupil: { x: 63.8, y: 49.2 },
  face: { left: 22, top: 20, width: 56, height: 55 },
  frame: { left: 28, top: 43.5, width: 48, height: 11 },
};

const ILLUSTRATION_LANDMARKS = {
  leftPupil: { x: 40.7, y: 47 },
  rightPupil: { x: 59.3, y: 47 },
  face: { left: 20, top: 14, width: 60, height: 68 },
  frame: { left: 30, top: 42, width: 40, height: 11 },
};

export function CameraOverlay({
  scanning,
  frameDetected = true,
  pupilsDetected = true,
  faceSrc,
}: CameraOverlayProps) {
  const imageSrc = faceSrc !== undefined ? faceSrc : FACE_FRONT;
  const landmarks = imageSrc ? PHOTO_LANDMARKS : ILLUSTRATION_LANDMARKS;

  return (
    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-[#0d131f] border border-white/10">
      {imageSrc ? (
        <img src={imageSrc} alt="Customer preview" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <FacePortrait className="absolute inset-0 w-full h-full" />
      )}

      {/* Face bounding box */}
      <div
        className="absolute rounded-2xl border-2 border-emerald-400/80"
        style={{
          left: `${landmarks.face.left}%`,
          top: `${landmarks.face.top}%`,
          width: `${landmarks.face.width}%`,
          height: `${landmarks.face.height}%`,
        }}
      >
        <span className="absolute -top-5 left-0 text-[9px] font-semibold text-emerald-300 bg-black/50 px-1.5 py-0.5 rounded">
          FACE
        </span>
      </div>

      {/* Frame bounding box */}
      {frameDetected && (
        <div
          className="absolute rounded-lg border-2 border-indigo-400/90"
          style={{
            left: `${landmarks.frame.left}%`,
            top: `${landmarks.frame.top}%`,
            width: `${landmarks.frame.width}%`,
            height: `${landmarks.frame.height}%`,
          }}
        >
          <span className="absolute -bottom-5 left-0 text-[9px] font-semibold text-indigo-300 bg-black/50 px-1.5 py-0.5 rounded">
            FRAME
          </span>
        </div>
      )}

      {/* Pupil markers with animated crosshair */}
      {pupilsDetected && (
        <>
          <PupilMarker x={landmarks.leftPupil.x} y={landmarks.leftPupil.y} />
          <PupilMarker x={landmarks.rightPupil.x} y={landmarks.rightPupil.y} />
          {/* Interpupillary measurement line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={`${landmarks.leftPupil.x}%`}
              y1={`${landmarks.leftPupil.y}%`}
              x2={`${landmarks.rightPupil.x}%`}
              y2={`${landmarks.rightPupil.y}%`}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          </svg>
        </>
      )}

      {/* Center alignment line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15" />
      {/* Horizontal reference line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

      {/* Scan line animation */}
      {scanning && (
        <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden">
          <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent animate-scanline" />
        </div>
      )}

      {/* Corner brackets */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-5 h-5 border-white/40 ${
            i === 0
              ? "border-t-2 border-l-2 rounded-tl-lg"
              : i === 1
              ? "border-t-2 border-r-2 rounded-tr-lg"
              : i === 2
              ? "border-b-2 border-l-2 rounded-bl-lg"
              : "border-b-2 border-r-2 rounded-br-lg"
          }`}
        />
      ))}
    </div>
  );
}

function PupilMarker({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-amber-300/70 animate-crosshair" />
        <span className="absolute w-full h-px bg-amber-300/60" />
        <span className="absolute h-full w-px bg-amber-300/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.7)]" />
      </div>
    </div>
  );
}
