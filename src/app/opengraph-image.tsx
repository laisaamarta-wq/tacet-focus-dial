import { ImageResponse } from "next/og";
import { brand } from "@/content/site";

export const alt = `${brand.product} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 90, background: "#1d2124", color: "#ecebe5" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, letterSpacing: 18, fontWeight: 300 }}>{brand.name}</div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#a0a7a5" }}>{brand.tagline}</div>
        </div>
        <div style={{ display: "flex", width: 280, height: 280, borderRadius: 280, background: "radial-gradient(circle at 50% 45%, #e9ecff 0%, #8ea0ff 20%, #3047ff 34%, #1d2124 36%, #3a4146 68%, #1d2124 70%)" }} />
      </div>
    ),
    size,
  );
}
