const frameModules = import.meta.glob("./frames/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function findFrame(name: string): string | null {
  const match = Object.entries(frameModules).find(([path]) => path.includes(`/${name}.`));
  return match ? match[1] : null;
}

// Product photos for the frame catalogue, one per mock frame in mockData.ts.
export const FRAME_IMAGES: Record<string, string | null> = {
  "yt-classic-101": findFrame("frame-03"),
  "yt-modern-204": findFrame("frame-01"),
  "yt-air-305": findFrame("frame-04"),
  "yt-urban-402": findFrame("frame-02"),
};
