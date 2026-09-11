const faceModules = import.meta.glob("./faces/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function findFace(name: string): string | null {
  const match = Object.entries(faceModules).find(([path]) => path.includes(`/${name}.`));
  return match ? match[1] : null;
}

// Of the 4 photos dropped into src/assets/faces/, face-4 is used consistently
// across the app as the customer photo (studio close-up, front-facing, clean
// white background) to match the mock customer "Sarah Ahmed". The other three
// photos (face-1, face-2, face-3) show different people/settings and are not
// used, to keep one consistent identity through the flow.
export const FACE_FRONT = findFace("face-4");
export const FACE_GLASSES = FACE_FRONT;
export const FACE_DETECTED = FACE_FRONT;
export const FACE_ALT = FACE_FRONT;

export const HAS_REAL_FACE_IMAGES = Boolean(FACE_FRONT);
