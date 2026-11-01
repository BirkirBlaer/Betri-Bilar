import { ImageResponse } from "next/og";
import { company } from "@/content/site";

export const alt = `${company.name} — bifreiðaverkstæði í Skeifunni, Reykjavík`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share image for Facebook, Messenger etc. Replace with a real workshop photo once approved.
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#151612", color: "#e9e8e3", padding: 72 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a3a59e" }}>
          <span>Bifreiðaverkstæði í Skeifunni</span>
          <span>Frá {company.foundedYear}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 176, fontWeight: 700, letterSpacing: -9, lineHeight: 0.9 }}>{company.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36, fontSize: 30, color: "#a3a59e" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#e3b52b" }} />
            Volkswagen · Škoda · Audi · Mitsubishi — sími {company.phone.display}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
