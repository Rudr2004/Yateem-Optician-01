import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Minus, Plus, Camera, Check } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { DraggableHandle } from "../components/DraggableHandle";
import { useAppState } from "../state/AppStateContext";
import { useToast } from "../components/Toast";
import { FACE_CALIBRATION_FRONT, FACE_CALIBRATION_SIDE } from "../assets/faceImages";

type Tab = "front" | "side";
type FrontPhase = "capture" | "calibrate";
type FrontStep = "pupils" | "box" | "diameter";
type SidePhase = "capture" | "calibrate";

interface Point {
  x: number;
  y: number;
}

interface LensBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Initial "AI guess" landmarks, calibrated against src/assets/faces/front-face.jpeg
// (measured directly on the photo, not eyeballed against a generic grid), in
// the 4:3 object-cover crop used by the Front calibration viewport (a
// tighter, more zoomed-in framing than the photo's native wide aspect). This
// is the coordinate space pupils/box/diameter math is all computed in, even
// though the Pupils step displays a further-zoomed view of the same photo
// (see PUPIL_ZOOM below) for easier precision on a small screen.
const INITIAL_LEFT_PUPIL: Point = { x: 39.5, y: 43 };
const INITIAL_RIGHT_PUPIL: Point = { x: 64.5, y: 44 };
const INITIAL_LEFT_BOX: LensBox = { left: 27, top: 34, width: 24, height: 29 };
const INITIAL_RIGHT_BOX: LensBox = { left: 53.5, top: 33, width: 24, height: 29 };

// Default zoom-in origin for the Box step: centered between both lens
// boxes, so it opens already zoomed in on the glasses (matching Pupils'
// always-zoomed treatment) instead of requiring a tap first.
const DEFAULT_BOX_ZOOM_ORIGIN: Point = {
  x: (INITIAL_LEFT_BOX.left + INITIAL_LEFT_BOX.width / 2 + INITIAL_RIGHT_BOX.left + INITIAL_RIGHT_BOX.width / 2) / 2,
  y: (INITIAL_LEFT_BOX.top + INITIAL_LEFT_BOX.height / 2 + INITIAL_RIGHT_BOX.top + INITIAL_RIGHT_BOX.height / 2) / 2,
};

// The Pupils step (and, on tap, the Box step) zoom further into the photo
// than the shared 4:3 crop, via CSS object-position + transform: scale(2) /
// transform-origin all set to the same point on the <img>. The actual
// resulting coordinate mapping was measured empirically — by locating 3
// landmarks (both pupils + nose tip) in both the flat and a zoomed crop and
// solving for the true per-axis scale — rather than assumed from the CSS
// property values, since object-position and transform-origin don't compose
// as a naive 1:1 linear mapping. Cross-checked against a second, different
// origin point to confirm the scale factors are origin-independent (only
// the origin itself shifts where the zoom is centered), so the same
// ZOOM_SCALE constants work for any tap-to-zoom origin, not just the
// Pupils step's fixed one.
const ZOOM_SCALE = { x: 1.64, y: 1.76 };
const PUPIL_ZOOM_ORIGIN: Point = { x: 55.9, y: 23.3 };

function toZoomedSpace(p: Point, origin: Point): Point {
  return {
    x: origin.x + (p.x - origin.x) * ZOOM_SCALE.x,
    y: origin.y + (p.y - origin.y) * ZOOM_SCALE.y,
  };
}
function fromZoomedSpace(p: Point, origin: Point): Point {
  return {
    x: origin.x + (p.x - origin.x) / ZOOM_SCALE.x,
    y: origin.y + (p.y - origin.y) / ZOOM_SCALE.y,
  };
}

// Reference scale for pupillary distance: the AI's initial pupil-to-pupil
// gap is assumed to correspond to a typical adult binocular PD (~63mm).
const REFERENCE_PUPIL_GAP_PCT = INITIAL_RIGHT_PUPIL.x - INITIAL_LEFT_PUPIL.x;
const REFERENCE_PD_MM = 63;
const MM_PER_PCT_PD = REFERENCE_PD_MM / REFERENCE_PUPIL_GAP_PCT;

// Keeps a dragged pupil within a plausible correction range of the AI's
// initial guess, so even a large or erratic drag can't push the derived PD
// outside a realistic adult range (~50-75mm total). Horizontal movement is
// tightly bounded since it drives PD directly; vertical movement (which
// only feeds fitting height, not PD) is allowed a bit more room.
const PUPIL_DRAG_RANGE_X_PCT = 1.4;
const PUPIL_DRAG_RANGE_Y_PCT = 4;
function clampPupil(point: Point, initial: Point): Point {
  return {
    x: Math.min(initial.x + PUPIL_DRAG_RANGE_X_PCT, Math.max(initial.x - PUPIL_DRAG_RANGE_X_PCT, point.x)),
    y: Math.min(initial.y + PUPIL_DRAG_RANGE_Y_PCT, Math.max(initial.y - PUPIL_DRAG_RANGE_Y_PCT, point.y)),
  };
}

const REFERENCE_LENS_MM = 50;

// Reference scale for the diameter circle. Sized larger than a tight
// lens-rim fit so the two circles visibly overlap near the bridge at the
// default 50mm (matching the reference design's intersecting-circles look),
// rather than sitting apart with a gap between them.
const REFERENCE_DIAMETER_PCT = 32.5;
const MM_PER_PCT_DIAMETER = REFERENCE_LENS_MM / REFERENCE_DIAMETER_PCT;

// Fitting height (SEGHT) is a much smaller physical gap than lens diameter
// and doesn't share the same box-width scale, so it gets its own reference:
// the initial box-bottom-to-pupil gap is anchored to a typical 19mm SEGHT.
const REFERENCE_SEGHT_GAP_PCT =
  (Math.abs(INITIAL_LEFT_BOX.top + INITIAL_LEFT_BOX.height - INITIAL_LEFT_PUPIL.y) +
    Math.abs(INITIAL_RIGHT_BOX.top + INITIAL_RIGHT_BOX.height - INITIAL_RIGHT_PUPIL.y)) /
  2;
const REFERENCE_SEGHT_MM = 19;
const MM_PER_PCT_SEGHT = REFERENCE_SEGHT_MM / REFERENCE_SEGHT_GAP_PCT;

function pctPdToMm(pct: number) {
  return pct * MM_PER_PCT_PD;
}

function pctBoxHeightToMm(pct: number) {
  return pct * MM_PER_PCT_SEGHT;
}

// Front capture screen: crosshair center for the circular viewport,
// calibrated against front-face.jpeg's 1:1 object-cover crop (midpoint
// between the pixel-precise left/right pupil positions in that crop).
const FRONT_CAPTURE_CENTER: Point = { x: 52.25, y: 43.75 };

// Simulated working distance (customer-to-camera) captured during the
// Front photo — this is a POC stand-in for real depth sensing, not derived
// from the 2D image.
const DEPTH_FROM_GLASSES_MM = 463.6;

// Initial "AI guess" landmarks for the Side Measurement tab, calibrated
// against the side-face photo (measured directly on the photo). The
// vertical reference line on the capture screen sits at the ear/hair
// boundary; the two BVD lines on the calibrate screen mark the lens front
// surface and the cornea, whose horizontal gap is the Back Vertex Distance.
const CAPTURE_REFERENCE_LINE_X = 86;
const INITIAL_LENS_LINE_X = 59;
const INITIAL_CORNEA_LINE_X = 66;

// Pantoscopic tilt is read live from the capture screen's angle ruler
// (0-100 slider position mapped to a realistic 0-25 degree range) rather
// than derived from a drag on the calibrate screen, matching the reference
// design. It carries forward into the calibrate screen as read-only.
const DEFAULT_RULER_POSITION = 68; // maps to ~8 degrees, the AI's initial guess
function rulerPositionToTilt(position: number) {
  return (position / 100) * 25;
}

// The vertical reference line tracks the angle ruler: dragging it away from
// the default position tilts the guide line's x-position by the same
// proportion, so the on-screen guide reflects the angle being dialed in.
const REFERENCE_LINE_DRAG_RANGE_PCT = 12;
function rulerPositionToReferenceLineX(position: number) {
  const delta = ((position - DEFAULT_RULER_POSITION) / 100) * REFERENCE_LINE_DRAG_RANGE_PCT;
  return CAPTURE_REFERENCE_LINE_X + delta;
}

// BVD reference: the initial lens-line-to-cornea-line horizontal gap is
// assumed to correspond to a typical 13.5mm Back Vertex Distance.
const REFERENCE_BVD_GAP_PCT = INITIAL_CORNEA_LINE_X - INITIAL_LENS_LINE_X;
const REFERENCE_BVD_MM = 13.5;
const MM_PER_PCT_BVD = REFERENCE_BVD_MM / REFERENCE_BVD_GAP_PCT;

function pctBvdToMm(pct: number) {
  return pct * MM_PER_PCT_BVD;
}

export function CalibrationScreen() {
  const navigate = useNavigate();
  const { updateMeasurement } = useAppState();
  const { showToast } = useToast();

  const [tab, setTab] = useState<Tab>("front");
  const [frontConfirmed, setFrontConfirmed] = useState(false);
  const [frontPhase, setFrontPhase] = useState<FrontPhase>("capture");
  const [frontStep, setFrontStep] = useState<FrontStep>("pupils");

  const [leftPupil, setLeftPupil] = useState<Point>(INITIAL_LEFT_PUPIL);
  const [rightPupil, setRightPupil] = useState<Point>(INITIAL_RIGHT_PUPIL);
  const [leftBox, setLeftBox] = useState<LensBox>(INITIAL_LEFT_BOX);
  const [rightBox, setRightBox] = useState<LensBox>(INITIAL_RIGHT_BOX);
  const [leftDiameter, setLeftDiameter] = useState(REFERENCE_LENS_MM);
  const [rightDiameter, setRightDiameter] = useState(REFERENCE_LENS_MM);
  // Box step opens already zoomed in on the glasses by default; null means
  // "not zoomed" and is reachable by tapping to toggle back to the wide
  // view, or tapping again to re-zoom (possibly centered elsewhere).
  const [boxZoomOrigin, setBoxZoomOrigin] = useState<Point | null>(DEFAULT_BOX_ZOOM_ORIGIN);

  const [sidePhase, setSidePhase] = useState<SidePhase>("capture");
  const [rulerPosition, setRulerPosition] = useState(DEFAULT_RULER_POSITION);
  const [wrapAngle, setWrapAngle] = useState(5);
  const [lensLineX, setLensLineX] = useState(INITIAL_LENS_LINE_X);
  const [corneaLineX, setCorneaLineX] = useState(INITIAL_CORNEA_LINE_X);

  const imageRef = useRef<HTMLDivElement>(null);
  const sideImageRef = useRef<HTMLDivElement>(null);
  const captureImageRef = useRef<HTMLDivElement>(null);
  const frontCaptureImageRef = useRef<HTMLDivElement>(null);

  // Bridge/midline reference: midpoint between the two pupils, used as the
  // "facial midline" anchor for monocular PD (distance from each pupil to center).
  const midlineX = useMemo(() => (leftPupil.x + rightPupil.x) / 2, [leftPupil.x, rightPupil.x]);

  const rightPd = useMemo(() => pctPdToMm(Math.abs(midlineX - rightPupil.x)), [midlineX, rightPupil.x]);
  const leftPd = useMemo(() => pctPdToMm(Math.abs(leftPupil.x - midlineX)), [leftPupil.x, midlineX]);
  const totalPd = rightPd + leftPd;

  const rightSegHeight = useMemo(
    () => pctBoxHeightToMm(Math.abs(rightBox.top + rightBox.height - rightPupil.y)),
    [rightBox, rightPupil.y]
  );
  const leftSegHeight = useMemo(
    () => pctBoxHeightToMm(Math.abs(leftBox.top + leftBox.height - leftPupil.y)),
    [leftBox, leftPupil.y]
  );

  const pantoscopicTilt = useMemo(() => rulerPositionToTilt(rulerPosition), [rulerPosition]);
  const bvd = useMemo(() => pctBvdToMm(Math.abs(corneaLineX - lensLineX)), [corneaLineX, lensLineX]);

  const photoSrc = FACE_CALIBRATION_FRONT;

  // Front Measurement is a 5-step flow: 1/5 frame already selected (implicit),
  // 2/5 capture, 3/5 pupils, 4/5 box, 5/5 diameter.
  const stepIndex = frontStep === "pupils" ? 1 : frontStep === "box" ? 2 : 3;
  const stepLabels: Record<FrontStep, string> = {
    pupils: "Set the correct center of the pupils.",
    box: "Set the correct box size (outside the lens).",
    diameter: "Set the correct diameter of lenses.",
  };

  function captureFrontPhoto() {
    setFrontPhase("calibrate");
  }

  function goBackToFrontCapture() {
    setFrontPhase("capture");
  }

  function goBackStep() {
    if (frontStep === "box") {
      setBoxZoomOrigin(DEFAULT_BOX_ZOOM_ORIGIN);
      setFrontStep("pupils");
    } else if (frontStep === "diameter") {
      setFrontStep("box");
    } else {
      goBackToFrontCapture();
    }
  }

  function confirmStep() {
    if (frontStep === "pupils") {
      setFrontStep("box");
      return;
    }
    if (frontStep === "box") {
      setBoxZoomOrigin(DEFAULT_BOX_ZOOM_ORIGIN);
      setFrontStep("diameter");
      return;
    }
    // Final Front step confirmed: write real values into shared measurement state.
    updateMeasurement("monocular-pd", {
      right: Math.round(rightPd * 10) / 10,
      left: Math.round(leftPd * 10) / 10,
      technicianRight: Math.round(rightPd * 10) / 10,
      technicianLeft: Math.round(leftPd * 10) / 10,
      validation: "edited",
    });
    updateMeasurement("fitting-height", {
      right: Math.round(rightSegHeight * 10) / 10,
      left: Math.round(leftSegHeight * 10) / 10,
      technicianRight: Math.round(rightSegHeight * 10) / 10,
      technicianLeft: Math.round(leftSegHeight * 10) / 10,
      validation: "edited",
    });
    updateMeasurement("lens-diameter", {
      single: Math.round(((leftDiameter + rightDiameter) / 2) * 10) / 10,
      technicianSingle: Math.round(((leftDiameter + rightDiameter) / 2) * 10) / 10,
      validation: "edited",
    });
    setFrontConfirmed(true);
    setTab("side");
    showToast("Front Measurement confirmed");
  }

  function captureSidePhoto() {
    setSidePhase("calibrate");
  }

  function goBackToCaptue() {
    setSidePhase("capture");
  }

  function confirmSideCalibration() {
    // Final Side step confirmed: write real values into shared measurement state.
    updateMeasurement("pantoscopic-tilt", {
      single: Math.round(pantoscopicTilt * 10) / 10,
      technicianSingle: Math.round(pantoscopicTilt * 10) / 10,
      validation: "edited",
    });
    updateMeasurement("wrap-angle", {
      single: wrapAngle,
      technicianSingle: wrapAngle,
      validation: "edited",
    });
    updateMeasurement("bvd", {
      single: Math.round(bvd * 10) / 10,
      technicianSingle: Math.round(bvd * 10) / 10,
      validation: "edited",
    });
    showToast("Side Measurement confirmed");
    navigate("/measure/results");
  }

  return (
    <AppScreen>
      {/* Tab bar */}
      <div className="flex-shrink-0 pt-[46px] bg-[var(--bg-card)] border-b border-[var(--border-soft)]">
        <div className="flex px-4 gap-2 pb-3">
          <button
            onClick={() => setTab("front")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold transition-colors ${
              tab === "front"
                ? "bg-[var(--navy)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                tab === "front" ? "bg-white/20" : "bg-white text-[var(--text-muted)]"
              }`}
            >
              {frontConfirmed ? <Check size={11} strokeWidth={3} /> : "1"}
            </span>
            Front Measurement
          </button>
          <button
            onClick={() => {
              if (!frontConfirmed) {
                showToast("Confirm Front Measurement first");
                return;
              }
              setTab("side");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold transition-colors ${
              tab === "side"
                ? "bg-[var(--navy)] text-white"
                : frontConfirmed
                ? "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                : "bg-[var(--bg-subtle)] text-[var(--text-muted)]/50 cursor-not-allowed"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                tab === "side" ? "bg-white/20" : "bg-white text-[var(--text-muted)]"
              }`}
            >
              2
            </span>
            Side Measurement
          </button>
        </div>
      </div>

      {tab === "front" ? (
        frontPhase === "capture" ? (
          <FrontCaptureView containerRef={frontCaptureImageRef} onCapture={captureFrontPhoto} />
        ) : (
        <>
          {/* Orange instruction bar */}
          <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center gap-3">
            <button
              onClick={goBackStep}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 active:bg-white/30 flex-shrink-0"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <div className="flex-1">
              <span className="inline-block text-[9px] font-bold text-white/90 bg-white/20 rounded-full px-2 py-0.5 mb-1">
                STEP {stepIndex + 1}/5
              </span>
              <p className="text-[13px] font-bold text-white leading-tight">{stepLabels[frontStep]}</p>
            </div>
            <button
              onClick={confirmStep}
              className="flex-shrink-0 bg-white text-orange-600 text-[12px] font-bold px-3.5 py-2 rounded-full active:bg-orange-50"
            >
              CONFIRM
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar animate-fade-slide-up">
            <div ref={imageRef} className="relative w-full aspect-[4/3] bg-[#111] overflow-hidden">
              {photoSrc && (
                <img
                  src={photoSrc}
                  alt="Customer front view"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={
                    frontStep === "pupils"
                      ? { objectPosition: "52% 30%", transform: "scale(2)", transformOrigin: "52% 30%" }
                      : frontStep === "box" && boxZoomOrigin
                      ? {
                          objectPosition: `${boxZoomOrigin.x}% ${boxZoomOrigin.y}%`,
                          transform: "scale(2)",
                          transformOrigin: `${boxZoomOrigin.x}% ${boxZoomOrigin.y}%`,
                        }
                      : undefined
                  }
                />
              )}

              {/* Tap-to-zoom layer for the Box step: opens already zoomed in
                  on the glasses by default; tap anywhere to zoom out to the
                  wide view, or tap again to re-zoom centered on that point. */}
              {frontStep === "box" && (
                <button
                  type="button"
                  aria-label={boxZoomOrigin ? "Zoom out" : "Zoom in on tapped point"}
                  className="absolute inset-0 w-full h-full z-10"
                  onClick={(e) => {
                    if (boxZoomOrigin) {
                      setBoxZoomOrigin(null);
                      return;
                    }
                    const rect = imageRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setBoxZoomOrigin({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100,
                    });
                  }}
                />
              )}

              {frontStep === "pupils" && (
                <>
                  <PupilDot point={toZoomedSpace(leftPupil, PUPIL_ZOOM_ORIGIN)} />
                  <PupilDot point={toZoomedSpace(rightPupil, PUPIL_ZOOM_ORIGIN)} />
                  <DraggableHandle
                    x={toZoomedSpace(leftPupil, PUPIL_ZOOM_ORIGIN).x}
                    y={toZoomedSpace(leftPupil, PUPIL_ZOOM_ORIGIN).y}
                    handleOffsetY={82}
                    sensitivity={0.4}
                    onChange={(x, y) =>
                      setLeftPupil(clampPupil(fromZoomedSpace({ x, y }, PUPIL_ZOOM_ORIGIN), INITIAL_LEFT_PUPIL))
                    }
                    containerRef={imageRef}
                    color="#f97316"
                  />
                  <DraggableHandle
                    x={toZoomedSpace(rightPupil, PUPIL_ZOOM_ORIGIN).x}
                    y={toZoomedSpace(rightPupil, PUPIL_ZOOM_ORIGIN).y}
                    handleOffsetY={82}
                    sensitivity={0.4}
                    onChange={(x, y) =>
                      setRightPupil(clampPupil(fromZoomedSpace({ x, y }, PUPIL_ZOOM_ORIGIN), INITIAL_RIGHT_PUPIL))
                    }
                    containerRef={imageRef}
                    color="#f97316"
                  />
                </>
              )}

              {frontStep === "box" && (
                <>
                  <LensBoxOverlay
                    box={leftBox}
                    initialBox={INITIAL_LEFT_BOX}
                    onChange={setLeftBox}
                    containerRef={imageRef}
                    zoomOrigin={boxZoomOrigin}
                  />
                  <LensBoxOverlay
                    box={rightBox}
                    initialBox={INITIAL_RIGHT_BOX}
                    onChange={setRightBox}
                    containerRef={imageRef}
                    zoomOrigin={boxZoomOrigin}
                  />
                </>
              )}

              {frontStep === "diameter" && (
                <>
                  <DiameterCircle center={leftPupil} diameterPct={mmToPctDiameter(leftDiameter)} />
                  <DiameterCircle center={rightPupil} diameterPct={mmToPctDiameter(rightDiameter)} />
                </>
              )}
            </div>

            <div className="px-4 py-4 space-y-3">
              {frontStep === "diameter" && (
                <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-2.5 shadow-sm flex items-center justify-center gap-1.5">
                  <DiameterStepperInline value={rightDiameter} onChange={setRightDiameter} />
                  <DiameterStepperInline value={leftDiameter} onChange={setLeftDiameter} />
                </div>
              )}

              <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-3 shadow-sm flex gap-3">
                <SummaryColumn title="Pupillary distance (PD)">
                  <BoxedField label="Right PD" value={`${rightPd.toFixed(1)} mm`} />
                  <BoxedField label="Left PD" value={`${leftPd.toFixed(1)} mm`} />
                  <BoxedField label="PD" value={`${totalPd.toFixed(1)} mm`} strong />
                </SummaryColumn>
                <SummaryColumn title="Fitting height (SEGHT)">
                  <BoxedField label="Right SEGHT" value={`${rightSegHeight.toFixed(1)} mm`} />
                  <BoxedField label="Left SEGHT" value={`${leftSegHeight.toFixed(1)} mm`} />
                </SummaryColumn>
                {frontStep === "diameter" && (
                  <SummaryColumn title="Diameter (DM)">
                    <BoxedField label="Right diameter" value={`${rightDiameter.toFixed(1)} mm`} />
                    <BoxedField label="Left diameter" value={`${leftDiameter.toFixed(1)} mm`} />
                  </SummaryColumn>
                )}
              </div>

              {(frontStep === "box" || frontStep === "diameter") && (
                <BoxedField label="Depth from glasses in mm" value={`${DEPTH_FROM_GLASSES_MM.toFixed(1)} mm`} />
              )}

              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                Simulated AI/CV landmark estimate. Drag the handles to correct pupil centers, lens
                box size and lens diameter. Values shown are POC estimates, not calibrated optical
                measurements.
              </p>
            </div>

            <MeasurementInstructions
              title={
                frontStep === "pupils"
                  ? "PUPILS MEASUREMENT INSTRUCTIONS"
                  : frontStep === "box"
                  ? "BOX SIZE MEASUREMENT INSTRUCTIONS"
                  : "DIAMETER MEASUREMENT INSTRUCTIONS"
              }
              lines={
                frontStep === "pupils"
                  ? [
                      "Drag each orange handle so the line points to the center of that pupil.",
                      "Zoom lets you fine-tune placement precisely.",
                      "Confirm once both pupils are centered.",
                    ]
                  : frontStep === "box"
                  ? [
                      "Drag the top-left and bottom-right handles so the red box tightly outlines the outside edge of each lens.",
                      "Tap the photo to zoom in or out for more precise placement.",
                      "Confirm once both boxes match the lens outline.",
                    ]
                  : [
                      "Use the +/- steppers to grow or shrink each lens's estimated diameter.",
                      "The red circle should roughly match the visible lens size.",
                      "Confirm once both diameters look correct.",
                    ]
              }
            />
          </div>
        </>
        )
      ) : sidePhase === "capture" ? (
        <SideCaptureView
          rulerPosition={rulerPosition}
          onChangeRulerPosition={setRulerPosition}
          pantoscopicTilt={pantoscopicTilt}
          containerRef={captureImageRef}
          onCapture={captureSidePhoto}
        />
      ) : (
        <>
          {/* Orange instruction bar */}
          <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center gap-3">
            <button
              onClick={goBackToCaptue}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 active:bg-white/30 flex-shrink-0"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <p className="flex-1 text-[13px] font-bold text-white leading-tight">
              Set the correct vertex distance.
            </p>
            <button
              onClick={confirmSideCalibration}
              className="flex-shrink-0 bg-white text-orange-600 text-[12px] font-bold px-3.5 py-2 rounded-full active:bg-orange-50"
            >
              CONFIRM
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar animate-fade-slide-up">
            <div ref={sideImageRef} className="relative w-full aspect-[16/10] bg-[#111] overflow-hidden">
              {FACE_CALIBRATION_SIDE && (
                <img
                  src={FACE_CALIBRATION_SIDE}
                  alt="Customer side view"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <VertexLineGuide
                lensLineX={lensLineX}
                corneaLineX={corneaLineX}
                onChangeLensLineX={setLensLineX}
                onChangeCorneaLineX={setCorneaLineX}
                containerRef={sideImageRef}
              />
            </div>

            <div className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard title="Back Vertex Distance (BVD)">
                  <SummaryRow label="BVD" value={`${bvd.toFixed(1)} mm`} strong />
                </SummaryCard>
                <SummaryCard title="Pantoscopic tilt (PANTO)">
                  <SummaryRow label="PANTO" value={`${pantoscopicTilt.toFixed(1)}°`} strong />
                </SummaryCard>
              </div>

              <SummaryCard title="Wrap Angle">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWrapAngle((v) => Math.max(0, v - 1))}
                    className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)] flex-shrink-0"
                  >
                    <Minus size={13} className="text-[var(--text-secondary)]" />
                  </button>
                  <span className="flex-1 text-center text-[13px] font-bold text-[var(--text-primary)]">
                    {wrapAngle}°
                  </span>
                  <button
                    onClick={() => setWrapAngle((v) => Math.min(20, v + 1))}
                    className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)] flex-shrink-0"
                  >
                    <Plus size={13} className="text-[var(--text-secondary)]" />
                  </button>
                </div>
              </SummaryCard>

              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                Simulated AI/CV landmark estimate from the side profile. Drag the vertical lines to
                correct the lens plane and cornea position. Pantoscopic tilt was set during capture;
                wrap angle is set manually since it can't be derived from a single side photo.
                Values shown are POC estimates, not calibrated optical measurements.
              </p>
            </div>
          </div>
        </>
      )}
    </AppScreen>
  );
}

function mmToPctDiameter(mm: number) {
  return mm / MM_PER_PCT_DIAMETER;
}

function PupilDot({ point }: { point: Point }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-red-500 border border-white -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    />
  );
}

// Bounds how far each corner can be dragged from its initial position, so
// the box stays a plausible lens-sized rectangle instead of being stretched
// into a distorted shape.
const BOX_CORNER_DRAG_RANGE_PCT = 6;
const MIN_BOX_SIZE = 6;

function LensBoxOverlay({
  box,
  initialBox,
  onChange,
  containerRef,
  zoomOrigin,
}: {
  box: LensBox;
  initialBox: LensBox;
  onChange: (box: LensBox) => void;
  containerRef: React.RefObject<HTMLElement | null>;
  zoomOrigin: Point | null;
}) {
  const right = box.left + box.width;
  const bottom = box.top + box.height;
  const initialLeft = initialBox.left;
  const initialTop = initialBox.top;
  const initialRight = initialBox.left + initialBox.width;
  const initialBottom = initialBox.top + initialBox.height;

  // All box math (state, clamping) stays in flat 4:3 space; only the
  // handles' and outline's on-screen position convert to zoomed-display
  // space when a tap-to-zoom is active, so dragging still feels 1:1 with
  // the pointer at whatever zoom level is showing.
  const toDisplay = (p: Point) => (zoomOrigin ? toZoomedSpace(p, zoomOrigin) : p);
  const fromDisplay = (p: Point) => (zoomOrigin ? fromZoomedSpace(p, zoomOrigin) : p);

  const topLeftDisplay = toDisplay({ x: box.left, y: box.top });
  const bottomRightDisplay = toDisplay({ x: right, y: bottom });

  return (
    <>
      <div
        className="absolute border-2 border-red-500"
        style={{
          left: `${topLeftDisplay.x}%`,
          top: `${topLeftDisplay.y}%`,
          width: `${bottomRightDisplay.x - topLeftDisplay.x}%`,
          height: `${bottomRightDisplay.y - topLeftDisplay.y}%`,
        }}
      />
      {/* Top-left corner: drags the left/top edges together */}
      <DraggableHandle
        x={topLeftDisplay.x}
        y={topLeftDisplay.y}
        size={22}
        sensitivity={0.4}
        onChange={(dx, dy) => {
          const { x: rawX, y: rawY } = fromDisplay({ x: dx, y: dy });
          const left = Math.min(
            Math.max(rawX, initialLeft - BOX_CORNER_DRAG_RANGE_PCT),
            Math.min(initialLeft + BOX_CORNER_DRAG_RANGE_PCT, right - MIN_BOX_SIZE)
          );
          const top = Math.min(
            Math.max(rawY, initialTop - BOX_CORNER_DRAG_RANGE_PCT),
            Math.min(initialTop + BOX_CORNER_DRAG_RANGE_PCT, bottom - MIN_BOX_SIZE)
          );
          onChange({ left, top, width: right - left, height: bottom - top });
        }}
        containerRef={containerRef}
        color="#ef4444"
      />
      {/* Bottom-right corner: drags the right/bottom edges together */}
      <DraggableHandle
        x={bottomRightDisplay.x}
        y={bottomRightDisplay.y}
        size={22}
        sensitivity={0.4}
        onChange={(dx, dy) => {
          const { x: rawX, y: rawY } = fromDisplay({ x: dx, y: dy });
          const newRight = Math.max(
            Math.min(rawX, initialRight + BOX_CORNER_DRAG_RANGE_PCT),
            Math.max(initialRight - BOX_CORNER_DRAG_RANGE_PCT, box.left + MIN_BOX_SIZE)
          );
          const newBottom = Math.max(
            Math.min(rawY, initialBottom + BOX_CORNER_DRAG_RANGE_PCT),
            Math.max(initialBottom - BOX_CORNER_DRAG_RANGE_PCT, box.top + MIN_BOX_SIZE)
          );
          onChange({ ...box, width: newRight - box.left, height: newBottom - box.top });
        }}
        containerRef={containerRef}
        color="#ef4444"
      />
    </>
  );
}

function DiameterCircle({ center, diameterPct }: { center: Point; diameterPct: number }) {
  return (
    <div
      className="absolute rounded-full border-2 border-red-500 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${center.x}%`,
        top: `${center.y}%`,
        width: `${diameterPct}%`,
        aspectRatio: "1 / 1",
      }}
    />
  );
}

// Compact single-row stepper control: [-] [value box] [+]. Two of these sit
// side by side in one shared card for the right/left lens diameters,
// matching the reference's continuous control-button row rather than two
// separate stacked cards.
function DiameterStepperInline({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(40, Math.round((value - 0.5) * 10) / 10))}
        className="w-9 h-9 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)] flex-shrink-0"
      >
        <Minus size={15} className="text-[var(--text-secondary)]" />
      </button>
      <span className="bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-lg px-2.5 py-2 text-[13px] font-bold text-[var(--text-primary)] whitespace-nowrap">
        {value.toFixed(1)} mm
      </span>
      <button
        onClick={() => onChange(Math.min(60, Math.round((value + 0.5) * 10) / 10))}
        className="w-9 h-9 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)] flex-shrink-0"
      >
        <Plus size={15} className="text-[var(--text-secondary)]" />
      </button>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-3 shadow-sm">
      <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
      <span
        className={`text-[12px] ${strong ? "font-bold text-[var(--royal)]" : "font-semibold text-[var(--text-primary)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

// A label with its value shown in a bordered, rounded box (rather than
// plain inline text), matching the reference screens' field-like styling.
function BoxedField({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <span className="text-[10px] text-[var(--text-secondary)] truncate min-w-0">{label}</span>
      <span
        className={`text-[11px] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-lg px-1.5 py-1 flex-shrink-0 whitespace-nowrap ${
          strong ? "font-bold text-[var(--royal)]" : "font-semibold text-[var(--text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

// Collapsible dark instructions footer, matching the Capture screens'
// pattern, reused across the Pupils/Box/Diameter calibration steps.
function MeasurementInstructions({ title, lines }: { title: string; lines: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 bg-[#111]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border-t border-white/10 text-white/70"
      >
        <span className="text-[11px] font-semibold tracking-wide">{title}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-[11px] text-white/60 leading-relaxed space-y-1.5">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function VertexLineGuide({
  lensLineX,
  corneaLineX,
  onChangeLensLineX,
  onChangeCorneaLineX,
  containerRef,
}: {
  lensLineX: number;
  corneaLineX: number;
  onChangeLensLineX: (x: number) => void;
  onChangeCorneaLineX: (x: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <>
      <VerticalDragLine x={lensLineX} handleY={54} onChange={onChangeLensLineX} containerRef={containerRef} color="#ef4444" />
      <VerticalDragLine x={corneaLineX} handleY={72} onChange={onChangeCorneaLineX} containerRef={containerRef} color="#ef4444" />
    </>
  );
}

function VerticalDragLine({
  x,
  handleY,
  onChange,
  containerRef,
  color,
}: {
  x: number;
  handleY: number;
  onChange: (x: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
  color: string;
}) {
  return (
    <>
      <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none" style={{ left: `${x}%`, background: color }} />
      <DraggableHandle
        x={x}
        y={handleY}
        size={30}
        sensitivity={0.4}
        onChange={(newX) => onChange(Math.min(95, Math.max(5, newX)))}
        containerRef={containerRef}
        color={color}
        icon="horizontal"
      />
    </>
  );
}

function FrontCaptureView({
  containerRef,
  onCapture,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCapture: () => void;
}) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [vOffset, setVOffset] = useState(FRONT_CAPTURE_CENTER.y);
  const [hOffset, setHOffset] = useState(FRONT_CAPTURE_CENTER.x);
  const vDraggingRef = useRef(false);
  const hDraggingRef = useRef(false);

  function clampAndSetV(clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setVOffset(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
  }

  function clampAndSetH(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHOffset(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <>
      {/* Tab bar handled by parent; step chip for this phase */}
      <div className="flex-shrink-0 bg-emerald-600 px-4 py-3">
        <p className="text-[13px] font-bold text-white leading-tight">
          Perfect! Stay still and gently tap shoot button.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111] animate-fade-slide-up">
        <div className="px-4 pt-4">
          <div className="flex items-stretch gap-3">
            {/* Vertical ruler (top-bottom alignment) */}
            <div
              className="relative w-9 flex-shrink-0 rounded-full overflow-hidden"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #ef4444 0 4%, #f97316 4% 8%, #f59e0b 8% 12%, #84cc16 12% 16%, #22c55e 16% 20%, #22c55e 20% 40%, #84cc16 40% 44%, #f59e0b 44% 48%, #f97316 48% 52%, #ef4444 52% 100%)",
              }}
              onPointerDown={(e) => {
                vDraggingRef.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                clampAndSetV(e.clientY);
              }}
              onPointerMove={(e) => {
                if (!vDraggingRef.current) return;
                clampAndSetV(e.clientY);
              }}
              onPointerUp={(e) => {
                vDraggingRef.current = false;
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }}
            >
              <div
                className="absolute -left-1.5 w-6 h-6 rounded-full bg-white border-4 border-emerald-500 shadow-lg -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing"
                style={{ top: `${vOffset}%` }}
              />
            </div>

            {/* Circular viewport with crosshair guide */}
            <div className="relative flex-1 aspect-square">
              <div ref={containerRef} className="absolute inset-0 rounded-full overflow-hidden border-2 border-white/80">
                {FACE_CALIBRATION_FRONT && (
                  <img
                    src={FACE_CALIBRATION_FRONT}
                    alt="Customer front view"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {/* Crosshair guide, driven by the vertical/horizontal alignment rulers */}
                <div className="absolute top-0 bottom-0 w-px bg-white/60 border-dashed" style={{ left: `${hOffset}%`, borderLeft: "1px dashed rgba(255,255,255,0.6)" }} />
                <div className="absolute left-0 right-0 h-px" style={{ top: `${vOffset}%`, borderTop: "1px dashed rgba(255,255,255,0.6)" }} />
              </div>
              {/* Shutter button, sitting outside the circular clip so it isn't cut off in the square's corner */}
              <button
                onClick={onCapture}
                className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-white/90 border-2 border-white flex items-center justify-center active:scale-95 transition-transform z-10"
              >
                <Camera size={18} className="text-[var(--navy)]" />
              </button>
            </div>
          </div>

          {/* Horizontal ruler (left-right alignment) */}
          <div
            className="relative h-9 mt-3 rounded-full overflow-hidden"
            style={{
              background:
                "repeating-linear-gradient(to right, #ef4444 0 4%, #f97316 4% 8%, #f59e0b 8% 12%, #84cc16 12% 16%, #22c55e 16% 20%, #22c55e 20% 40%, #84cc16 40% 44%, #f59e0b 44% 48%, #f97316 48% 52%, #ef4444 52% 100%)",
            }}
            onPointerDown={(e) => {
              hDraggingRef.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              clampAndSetH(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!hDraggingRef.current) return;
              clampAndSetH(e.clientX);
            }}
            onPointerUp={(e) => {
              hDraggingRef.current = false;
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            }}
          >
            <div
              className="absolute -top-1.5 h-6 w-6 rounded-full bg-white border-4 border-emerald-500 shadow-lg -translate-x-1/2 touch-none cursor-grab active:cursor-grabbing"
              style={{ left: `${hOffset}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setInstructionsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 mt-4 border-t border-white/10 text-white/70"
        >
          <span className="text-[11px] font-semibold tracking-wide">FACE POSITIONING INSTRUCTIONS</span>
          <ChevronDown size={16} className={`transition-transform ${instructionsOpen ? "rotate-180" : ""}`} />
        </button>
        {instructionsOpen && (
          <div className="px-4 pb-4 text-[11px] text-white/60 leading-relaxed space-y-1.5">
            <p>Center the customer's face inside the circular guide.</p>
            <p>Use the side and bottom rulers to align the face both vertically and horizontally.</p>
            <p>Keep the frame level and both eyes visible.</p>
            <p>Tap the shutter to capture and continue to pupil calibration.</p>
          </div>
        )}
      </div>
    </>
  );
}

function SideCaptureView({
  rulerPosition,
  onChangeRulerPosition,
  pantoscopicTilt,
  containerRef,
  onCapture,
}: {
  rulerPosition: number;
  onChangeRulerPosition: (v: number) => void;
  pantoscopicTilt: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCapture: () => void;
}) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const draggingRef = useRef(false);

  function clampAndSet(clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChangeRulerPosition(100 - pct);
  }

  return (
    <>
      {/* Green success banner */}
      <div className="flex-shrink-0 bg-emerald-600 px-4 py-3">
        <p className="text-[13px] font-bold text-white leading-tight">
          Perfect! Stay still and gently tap shoot button.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111] animate-fade-slide-up">
        <div className="relative px-4 pt-4">
          <div className="flex items-stretch gap-3">
            {/* Color-gradient angle ruler */}
            <div
              ref={containerRef}
              className="relative w-9 flex-shrink-0 rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(to bottom, #ef4444, #f97316, #f59e0b, #eab308, #84cc16, #22c55e)",
              }}
              onPointerDown={(e) => {
                draggingRef.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                clampAndSet(e.clientY);
              }}
              onPointerMove={(e) => {
                if (!draggingRef.current) return;
                clampAndSet(e.clientY);
              }}
              onPointerUp={(e) => {
                draggingRef.current = false;
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="absolute left-1 right-1 h-px bg-black/20" style={{ top: `${(i / 13) * 100}%` }} />
              ))}
              <div
                className="absolute -left-1.5 w-6 h-6 rounded-full bg-white border-4 border-emerald-500 shadow-lg -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing"
                style={{ top: `${100 - rulerPosition}%` }}
              />
            </div>

            {/* Rounded viewport (D-shape: straight left edge, rounded elsewhere) */}
            <div className="relative flex-1 aspect-[3/4] rounded-r-[48px] rounded-l-2xl overflow-hidden border-2 border-white/80">
              {FACE_CALIBRATION_SIDE && (
                <img
                  src={FACE_CALIBRATION_SIDE}
                  alt="Customer side view"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Vertical reference line, shifts with the angle ruler */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-red-500"
                style={{ left: `${rulerPositionToReferenceLineX(rulerPosition)}%` }}
              />
              {/* Shutter button */}
              <button
                onClick={onCapture}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 border-2 border-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <Camera size={18} className="text-[var(--navy)]" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[12px] text-white/80 font-medium">
            Pantoscopic angle: <span className="text-white font-bold">{pantoscopicTilt.toFixed(1)}°</span>
          </div>
        </div>

        <button
          onClick={() => setInstructionsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 mt-4 border-t border-white/10 text-white/70"
        >
          <span className="text-[11px] font-semibold tracking-wide">SIDE MEASUREMENTS INSTRUCTIONS</span>
          <ChevronDown size={16} className={`transition-transform ${instructionsOpen ? "rotate-180" : ""}`} />
        </button>
        {instructionsOpen && (
          <div className="px-4 pb-4 text-[11px] text-white/60 leading-relaxed space-y-1.5">
            <p>Turn the customer's head to a full side profile.</p>
            <p>Align the vertical guide line with the front of the ear.</p>
            <p>Drag the angle dot on the left to match the frame's visible tilt.</p>
            <p>Tap the shutter to capture and continue to vertex distance calibration.</p>
          </div>
        )}
      </div>
    </>
  );
}
