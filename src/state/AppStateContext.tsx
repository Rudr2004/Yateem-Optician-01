import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type {
  AppState,
  Customer,
  Frame,
  LensType,
  CoatingKey,
  TintColor,
  MeasurementValue,
} from "../types";
import {
  MOCK_CUSTOMER,
  DEFAULT_MEASUREMENTS,
  DEFAULT_THICKNESS_INPUTS,
  generateMeasurementId,
} from "../mockData";

function initialState(): AppState {
  return {
    customer: MOCK_CUSTOMER,
    selectedFrame: null,
    measurementStatus: "idle",
    aiScanProgress: 0,
    aiConfidence: 96,
    measurements: DEFAULT_MEASUREMENTS.map((m) => ({ ...m })),
    lensType: null,
    coatings: [],
    lensIndex: DEFAULT_THICKNESS_INPUTS.lensIndex,
    thicknessInputs: { ...DEFAULT_THICKNESS_INPUTS },
    thicknessEstimate: null,
    tint: { color: "Grey", opacity: 50 },
    measurementId: generateMeasurementId(),
  };
}

interface AppStateContextValue {
  state: AppState;
  updateCustomer: (patch: Partial<Customer>) => void;
  setFrame: (frame: Frame) => void;
  setMeasurementStatus: (status: AppState["measurementStatus"]) => void;
  setAiScanProgress: (progress: number) => void;
  updateMeasurement: (key: string, patch: Partial<MeasurementValue>) => void;
  acceptAllMeasurements: () => void;
  setLensType: (lens: LensType) => void;
  toggleCoating: (coating: CoatingKey) => void;
  setThicknessInputs: (patch: Partial<AppState["thicknessInputs"]>) => void;
  computeThicknessEstimate: () => void;
  setTintColor: (color: TintColor) => void;
  setTintOpacity: (opacity: AppState["tint"]["opacity"]) => void;
  resetFlow: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState());

  const updateCustomer = useCallback((patch: Partial<Customer>) => {
    setState((s) => ({ ...s, customer: { ...s.customer, ...patch } }));
  }, []);

  const setFrame = useCallback((frame: Frame) => {
    setState((s) => ({ ...s, selectedFrame: frame }));
  }, []);

  const setMeasurementStatus = useCallback((status: AppState["measurementStatus"]) => {
    setState((s) => ({ ...s, measurementStatus: status }));
  }, []);

  const setAiScanProgress = useCallback((progress: number) => {
    setState((s) => ({ ...s, aiScanProgress: progress }));
  }, []);

  const updateMeasurement = useCallback((key: string, patch: Partial<MeasurementValue>) => {
    setState((s) => ({
      ...s,
      measurements: s.measurements.map((m) => (m.key === key ? { ...m, ...patch } : m)),
    }));
  }, []);

  const acceptAllMeasurements = useCallback(() => {
    setState((s) => ({
      ...s,
      measurements: s.measurements.map((m) => ({ ...m, validation: "accepted" as const })),
    }));
  }, []);

  const setLensType = useCallback((lens: LensType) => {
    setState((s) => ({ ...s, lensType: lens }));
  }, []);

  const toggleCoating = useCallback((coating: CoatingKey) => {
    setState((s) => ({
      ...s,
      coatings: s.coatings.includes(coating)
        ? s.coatings.filter((c) => c !== coating)
        : [...s.coatings, coating],
    }));
  }, []);

  const setThicknessInputs = useCallback((patch: Partial<AppState["thicknessInputs"]>) => {
    setState((s) => ({ ...s, thicknessInputs: { ...s.thicknessInputs, ...patch } }));
  }, []);

  const computeThicknessEstimate = useCallback(() => {
    setState((s) => {
      const { sphere, cylinder, frameWidth, dbl, lensIndex } = s.thicknessInputs;
      const refractiveIndex: Record<string, number> = {
        "1.50": 1.5,
        "1.56": 1.56,
        "1.60": 1.6,
        "1.67": 1.67,
        "1.74": 1.74,
      };
      const n = refractiveIndex[lensIndex] ?? 1.56;
      const power = Math.abs(sphere) + Math.abs(cylinder) * 0.5;
      const semiDiameter = (frameWidth + dbl) / 2 / 2;

      // Approximate lens sag (thickness variation) using a simplified lensmaker's formula.
      const sag = (Math.pow(semiDiameter, 2) * power) / (2000 * (n - 1));

      const minEdgeThickness = 1.0;
      const minCenterThickness = 1.0;

      let centerThickness: number;
      let edgeThickness: number;

      if (sphere < 0) {
        // Minus lens: thin center, thick edge.
        centerThickness = minCenterThickness;
        edgeThickness = minCenterThickness + sag;
      } else {
        // Plus lens: thick center, thin edge.
        centerThickness = minEdgeThickness + sag;
        edgeThickness = minEdgeThickness;
      }

      let recommendedIndex = "1.56";
      if (power >= 6) recommendedIndex = "1.74";
      else if (power >= 4) recommendedIndex = "1.67";
      else if (power >= 2) recommendedIndex = "1.60";
      else recommendedIndex = "1.56";

      return {
        ...s,
        thicknessEstimate: {
          centerThickness: Math.round(centerThickness * 10) / 10,
          edgeThickness: Math.round(edgeThickness * 10) / 10,
          recommendedIndex,
        },
      };
    });
  }, []);

  const setTintColor = useCallback((color: TintColor) => {
    setState((s) => ({ ...s, tint: { ...s.tint, color } }));
  }, []);

  const setTintOpacity = useCallback((opacity: AppState["tint"]["opacity"]) => {
    setState((s) => ({ ...s, tint: { ...s.tint, opacity } }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(initialState());
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        state,
        updateCustomer,
        setFrame,
        setMeasurementStatus,
        setAiScanProgress,
        updateMeasurement,
        acceptAllMeasurements,
        setLensType,
        toggleCoating,
        setThicknessInputs,
        computeThicknessEstimate,
        setTintColor,
        setTintOpacity,
        resetFlow,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
