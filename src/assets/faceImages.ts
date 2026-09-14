const faceModules = import.meta.glob("./faces/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function findFace(name: string): string | null {
  const match = Object.entries(faceModules).find(([path]) => path.includes(`/${name}.`));
  return match ? match[1] : null;
}

// Single source of truth for the customer's front-facing photo. Used across
// every screen that shows the customer front-on (Camera, Scanning, Front
// Measurement calibration, Results, Tint) so the same face appears
// throughout the flow. front-face.jpeg shows the customer already wearing
// frames, which the Front Measurement calibration step depends on.
export const FACE_FRONT = findFace("front-face");
export const FACE_GLASSES = FACE_FRONT;
export const FACE_DETECTED = FACE_FRONT;
export const FACE_ALT = FACE_FRONT;
export const FACE_CALIBRATION_FRONT = FACE_FRONT;

// Dedicated profile photo for the Side Measurement calibration step.
export const FACE_CALIBRATION_SIDE = findFace("side-face");

export const HAS_REAL_FACE_IMAGES = Boolean(FACE_FRONT);
