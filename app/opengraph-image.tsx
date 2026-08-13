import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getRestaurant } from "@/services/content";

export const alt = "Fusion Flame — Ignite Your Taste Experience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [playfair, cormorant, inter, flameMark, restaurant] = await Promise.all([
    readFile(join(process.cwd(), "lib/og-fonts/PlayfairDisplay-Bold.woff")),
    readFile(join(process.cwd(), "lib/og-fonts/CormorantGaramond-MediumItalic.woff")),
    readFile(join(process.cwd(), "lib/og-fonts/Inter-Regular.woff")),
    readFile(join(process.cwd(), "public/flame-mark.png")),
    getRestaurant(),
  ]);

  const flameMarkSrc = `data:image/png;base64,${flameMark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#050505",
          fontFamily: "Inter",
        }}
      >
        {/* Ambient fire glow — one gradient per layer; satori doesn't reliably
            support the `inset` shorthand or multi-layer background-image, so
            each glow is its own absolutely-positioned, explicitly-offset div. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,138,6,0.22) 0%, rgba(255,138,6,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 92% 100%, rgba(221,169,67,0.20) 0%, rgba(221,169,67,0) 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 4% 100%, rgba(249,19,4,0.18) 0%, rgba(249,19,4,0) 55%)",
          }}
        />

        {/* Border frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            display: "flex",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgba(221,169,67,0.4)",
          }}
        />

        {/* Flame mark */}
        <img src={flameMarkSrc} width={168} height={168} alt="" style={{ marginBottom: 4 }} />

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            fontFamily: "PlayfairDisplay",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          <span style={{ color: "#dda943" }}>Fusion</span>
          <span style={{ color: "#f91304", marginLeft: 24 }}>Flame</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontFamily: "CormorantGaramond",
            fontStyle: "italic",
            fontSize: 36,
            color: "#fafafa",
            opacity: 0.88,
            marginTop: 10,
          }}
        >
          Ignite Your Taste Experience
        </div>

        {/* Location pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 34,
            padding: "10px 28px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            backgroundColor: "rgba(255,255,255,0.04)",
            color: "#a0a0a0",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {restaurant.address.suburb}, {restaurant.address.city} · fusionflame.co.za
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PlayfairDisplay", data: playfair, weight: 700, style: "normal" },
        { name: "CormorantGaramond", data: cormorant, weight: 500, style: "italic" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
    },
  );
}
