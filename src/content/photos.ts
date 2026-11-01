/**
 * Photo slots used on the website — defined in photo-slots.json.
 * Each slot is filled by `npm run photos` from /photos-inbox/<slot id>.jpg (see README → "Myndir").
 * Until a slot is filled, a placeholder frame is shown in its place.
 *
 * All photos from Betri Bílar's Facebook page need the owner's permission before publishing.
 */
import slots from "./photo-slots.json";
import manifest from "./photo-manifest.json";

export type PhotoSlot = {
  id: string;
  folder: "hero" | "workshop" | "services" | "team" | "gallery";
  /** [width, height] ratio of the final crop. */
  aspect: [number, number];
  /** What the photo should show — guidance when picking from Facebook. */
  brief: string;
  /** Icelandic alt text. Update it to describe the actual photo. */
  alt: string;
};

export type ProcessedPhoto = { src: string; width: number; height: number; blur: string; alt?: string };

export const photoSlots = slots as PhotoSlot[];
const processed = manifest as Record<string, ProcessedPhoto>;

export function getPhoto(id: string) {
  const slot = photoSlots.find((s) => s.id === id);
  if (!slot) throw new Error(`Unknown photo slot: ${id}`);
  return { slot, photo: processed[id] as ProcessedPhoto | undefined };
}
