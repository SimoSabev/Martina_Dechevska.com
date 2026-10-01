import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSettings } from "@/lib/content";

export const alt = "Martina Dechevska — Journalist and Real Estate Broker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files");

export default async function OpenGraphImage() {
  const [settings, regular, italic] = await Promise.all([
    getSettings(),
    readFile(join(fontDir, "cormorant-garamond-latin-500-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-latin-500-italic.woff")),
  ]);
  const [first, ...rest] = settings.name.split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "#141412",
          color: "#f6f3ec",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 64, height: 1, background: "#c5d24a" }} />
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#a8a398" }}>
            {settings.roleLine.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.95 }}>
          <div style={{ fontSize: 150 }}>{first}</div>
          <div style={{ fontSize: 150, fontStyle: "italic", paddingLeft: 90 }}>{rest.join(" ")}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#a8a398" }}>
          <span>martinadechevska.com</span>
          <span style={{ color: "#c5d24a" }}>M·D</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: regular, style: "normal", weight: 500 },
        { name: "Cormorant", data: italic, style: "italic", weight: 500 },
      ],
    },
  );
}
