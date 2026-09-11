export interface Customer {
  name: string;
  customerId: string;
  phone: string;
  dob: string;
}

export type FrameShape = "rectangle" | "round" | "cat-eye";

export interface Frame {
  id: string;
  frameCode: string;
  name: string;
  rimType: string;
  material: string;
  frameA: number;
  frameB: number;
  dbl: number;
  color: string;
  shape: FrameShape;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface DetectionState {
  label: string;
  status: "pending" | "detecting" | "done";
  confidence?: number;
}

export interface MeasurementValue {
  key: string;
  name: string;
  right?: number;
  left?: number;
  single?: number;
  unit: string;
  confidence: number;
  tolerance: string;
  status: "ok" | "review";
  technicianRight?: number;
  technicianLeft?: number;
  technicianSingle?: number;
  validation: "pending" | "accepted" | "edited" | "rejected";
}

export type LensType = "Single Vision" | "Progressive" | "Anti-Fatigue" | "Computer";

export type CoatingKey =
  | "Anti-Reflective"
  | "Blue-Light Filtering"
  | "Night Driving"
  | "Polarized"
  | "UV Protection"
  | "Scratch Resistant";

export interface ThicknessInputs {
  sphere: number;
  cylinder: number;
  axis: number;
  frameWidth: number;
  frameHeight: number;
  dbl: number;
  lensIndex: "1.50" | "1.56" | "1.60" | "1.67" | "1.74";
}

export interface ThicknessEstimate {
  centerThickness: number;
  edgeThickness: number;
  recommendedIndex: string;
}

export type TintColor = "Grey" | "Brown" | "Green" | "Blue" | "Rose";

export interface TintConfig {
  color: TintColor;
  opacity: 25 | 50 | 70 | 80;
}

export interface AppState {
  customer: Customer;
  selectedFrame: Frame | null;
  measurementStatus: "idle" | "scanning" | "complete";
  aiScanProgress: number;
  aiConfidence: number;
  measurements: MeasurementValue[];
  lensType: LensType | null;
  coatings: CoatingKey[];
  lensIndex: ThicknessInputs["lensIndex"];
  thicknessInputs: ThicknessInputs;
  thicknessEstimate: ThicknessEstimate | null;
  tint: TintConfig;
  measurementId: string;
}
