import type { Customer, Frame, MeasurementValue, CoatingKey, ThicknessInputs } from "./types";

export const MOCK_CUSTOMER: Customer = {
  name: "Sarah Ahmed",
  customerId: "YT-2026-00124",
  phone: "+971 50 123 4567",
  dob: "14 Mar 1990",
};

export const MOCK_FRAMES: Frame[] = [
  {
    id: "yt-classic-101",
    frameCode: "YT-R101",
    name: "YT Classic 101",
    rimType: "Full Rim",
    material: "Metal",
    frameA: 52,
    frameB: 40,
    dbl: 18,
    color: "#5b6472",
    shape: "round",
  },
  {
    id: "yt-modern-204",
    frameCode: "YT-R202",
    name: "YT Modern 204",
    rimType: "Full Rim",
    material: "Acetate",
    frameA: 54,
    frameB: 42,
    dbl: 18,
    color: "#1c2333",
    shape: "rectangle",
  },
  {
    id: "yt-air-305",
    frameCode: "YT-R305",
    name: "YT Air 305",
    rimType: "Semi Rimless",
    material: "Titanium",
    frameA: 51,
    frameB: 39,
    dbl: 19,
    color: "#8a93a3",
    shape: "round",
  },
  {
    id: "yt-urban-402",
    frameCode: "YT-R402",
    name: "YT Urban 402",
    rimType: "Full Rim",
    material: "Acetate",
    frameA: 53,
    frameB: 44,
    dbl: 17,
    color: "#7a3b28",
    shape: "cat-eye",
  },
];

export type FittingStatus = "completed" | "pending";

export interface RecentFitting {
  id: string;
  customerName: string;
  customerId: string;
  frameName: string;
  status: FittingStatus;
  date: string;
  time: string;
}

// Dummy fitting records for the Home screen's stat cards and list items.
// "Recent Measurements" shows every record here (spanning today and
// yesterday); "Today's Measurements" / "Completed" / "Pending" filter by
// date/status.
export const RECENT_FITTINGS: RecentFitting[] = [
  { id: "f1", customerName: "Sarah Ahmed", customerId: "YT-2026-00124", frameName: "YT Classic 101", status: "completed", date: "Today", time: "10:24 AM" },
  { id: "f2", customerName: "Omar Al Farsi", customerId: "YT-2026-00125", frameName: "YT Modern 204", status: "completed", date: "Today", time: "10:52 AM" },
  { id: "f3", customerName: "Layla Hassan", customerId: "YT-2026-00126", frameName: "YT Air 305", status: "completed", date: "Today", time: "11:15 AM" },
  { id: "f4", customerName: "Yousef Nasser", customerId: "YT-2026-00127", frameName: "YT Urban 402", status: "pending", date: "Today", time: "11:40 AM" },
  { id: "f5", customerName: "Fatima Al Zaabi", customerId: "YT-2026-00128", frameName: "YT Classic 101", status: "pending", date: "Today", time: "12:05 PM" },
  { id: "f6", customerName: "Khalid Rahman", customerId: "YT-2026-00129", frameName: "YT Modern 204", status: "pending", date: "Today", time: "12:30 PM" },
  { id: "f7", customerName: "Mariam Saeed", customerId: "YT-2026-00122", frameName: "YT Air 305", status: "completed", date: "Yesterday", time: "3:10 PM" },
  { id: "f8", customerName: "Ahmed Bin Rashid", customerId: "YT-2026-00123", frameName: "YT Urban 402", status: "completed", date: "Yesterday", time: "4:45 PM" },
];

export const DEFAULT_MEASUREMENTS: MeasurementValue[] = [
  {
    key: "monocular-pd",
    name: "Monocular PD",
    right: 31.0,
    left: 31.5,
    unit: "mm",
    confidence: 96,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianRight: 31.0,
    technicianLeft: 31.5,
    validation: "pending",
  },
  {
    key: "near-pd",
    name: "Near PD",
    right: 29.5,
    left: 30.0,
    unit: "mm",
    confidence: 95,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianRight: 29.5,
    technicianLeft: 30.0,
    validation: "pending",
  },
  {
    key: "fitting-height",
    name: "Fitting Height / Seg Height",
    right: 18.5,
    left: 18.0,
    unit: "mm",
    confidence: 89,
    tolerance: "±1.0 mm",
    status: "review",
    technicianRight: 18.5,
    technicianLeft: 18.0,
    validation: "pending",
  },
  {
    key: "pantoscopic-tilt",
    name: "Pantoscopic Tilt",
    single: 8,
    unit: "°",
    confidence: 97,
    tolerance: "±1–2°",
    status: "ok",
    technicianSingle: 8,
    validation: "pending",
  },
  {
    key: "wrap-angle",
    name: "Wrap Angle / Face Form Angle",
    single: 5,
    unit: "°",
    confidence: 96,
    tolerance: "±1–2°",
    status: "ok",
    technicianSingle: 5,
    validation: "pending",
  },
  {
    key: "bvd",
    name: "Back Vertex Distance",
    single: 13.5,
    unit: "mm",
    confidence: 98,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianSingle: 13.5,
    validation: "pending",
  },
  {
    key: "lens-diameter",
    name: "Lens Diameter",
    single: 52,
    unit: "mm",
    confidence: 97,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianSingle: 52,
    validation: "pending",
  },
  {
    key: "reading-distance",
    name: "Reading Distance",
    single: 400,
    unit: "mm",
    confidence: 95,
    tolerance: "±10–20 mm",
    status: "ok",
    technicianSingle: 400,
    validation: "pending",
  },
  {
    key: "frame-a",
    name: "Frame A / Lens Width",
    single: 52,
    unit: "mm",
    confidence: 98,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianSingle: 52,
    validation: "pending",
  },
  {
    key: "frame-b",
    name: "Frame B / Lens Height",
    single: 40,
    unit: "mm",
    confidence: 97,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianSingle: 40,
    validation: "pending",
  },
  {
    key: "frame-c-dbl",
    name: "Frame C / DBL / Bridge",
    single: 18,
    unit: "mm",
    confidence: 96,
    tolerance: "±0.5 mm",
    status: "ok",
    technicianSingle: 18,
    validation: "pending",
  },
];

export const COATING_OPTIONS: CoatingKey[] = [
  "Anti-Reflective",
  "Blue-Light Filtering",
  "Night Driving",
  "Polarized",
  "UV Protection",
  "Scratch Resistant",
];

export const DEFAULT_THICKNESS_INPUTS: ThicknessInputs = {
  sphere: -2.5,
  cylinder: -0.75,
  axis: 90,
  frameWidth: 52,
  frameHeight: 40,
  dbl: 18,
  lensIndex: "1.56",
};

export const LENS_INDEX_OPTIONS: ThicknessInputs["lensIndex"][] = [
  "1.50",
  "1.56",
  "1.60",
  "1.67",
  "1.74",
];

export function generateMeasurementId(): string {
  return "YT-SF-2026-00124";
}

export const CV_PIPELINE_STAGES = [
  "Face Detection",
  "Facial Landmark Detection",
  "Eye Detection",
  "Pupil Detection",
  "Frame Detection",
  "Lens Edge Detection",
  "Frame Geometry Analysis",
  "Optical Measurement Calculation",
  "Measurement Validation",
  "Final Measurements",
];

export const SCANNING_STEPS = [
  { key: "face", label: "Detecting Face" },
  { key: "eyes", label: "Detecting Eyes" },
  { key: "pupils", label: "Locating Pupils" },
  { key: "frame", label: "Detecting Frame" },
  { key: "lens-edges", label: "Detecting Lens Edges" },
  { key: "geometry", label: "Analyzing Frame Geometry" },
  { key: "measurements", label: "Calculating Optical Measurements" },
  { key: "validation", label: "Validating Measurements" },
];

export const CAMERA_INSTRUCTIONS = [
  "Position the customer's face inside the guide.",
  "Keep the customer's head straight.",
  "Look directly at the camera.",
  "Frame alignment detected.",
  "Ready to capture.",
];

export const MEASUREMENT_DEFINITIONS: Record<string, string> = {
  "monocular-pd":
    "Distance from center of pupil to center of the bridge/facial midline, measured separately per eye.",
  "near-pd": "Monocular or binocular PD measured at the intended reading distance (convergence-adjusted).",
  "fitting-height":
    "Vertical distance from the lowest point of the frame's inner rim to the center of the pupil, with the wearer in natural posture.",
  "pantoscopic-tilt":
    "Angle between the spectacle plane and the vertical facial plane (frame front tilted forward at the bottom).",
  "wrap-angle":
    "Horizontal curvature angle of the frame front relative to the wearer's face, measured in the frontal plane.",
  bvd: "Distance from the back surface of the lens to the front surface of the cornea.",
  "lens-diameter": "Effective/minimum diameter of the lens blank required to glaze the chosen frame.",
  "reading-distance":
    "Habitual distance from eye to reading material/task, used to compute near-vision PD and add power needs.",
  "frame-a": "Horizontal width of the lens shape at its widest point (boxing system).",
  "frame-b": "Vertical height of the lens shape at its tallest point (boxing system).",
  "frame-c-dbl": "Distance between the two lens shapes across the bridge (boxing system).",
};
