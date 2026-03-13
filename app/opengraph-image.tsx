import { ImageResponse } from "next/og";
import { getAssetDataUrl } from "@/lib/seo/brand-assets";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [banner, logo] = await Promise.all([
    getAssetDataUrl("yisos-banner.png"),
    getAssetDataUrl("yisos-logo.png")
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 18% 0%, rgba(90,98,15,0.28), transparent 34%), radial-gradient(circle at 100% 100%, rgba(200,148,52,0.16), transparent 28%), linear-gradient(180deg, #050505 0%, #0d0908 100%)",
          color: "#f2eee3"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(125deg, rgba(0,0,0,0.1), rgba(0,0,0,0.45)), repeating-linear-gradient(90deg, rgba(255,255,255,0.015), rgba(255,255,255,0.015) 1px, transparent 1px, transparent 18px)"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            width: "100%",
            padding: "52px 58px",
            justifyContent: "space-between",
            alignItems: "stretch"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "68%"
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                padding: "22px 28px",
                borderRadius: 24,
                border: "1px solid rgba(200,148,52,0.24)",
                background: "linear-gradient(180deg, rgba(22,17,15,0.82), rgba(10,10,10,0.78))"
              }}
            >
              <img src={banner} alt="YISOS banner" width="760" height="160" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 8,
                  textTransform: "uppercase",
                  color: "#c89434"
                }}
              >
                Premium Ritual House
              </div>
              <div
                style={{
                  fontSize: 64,
                  lineHeight: 1.02,
                  fontWeight: 700,
                  maxWidth: 700
                }}
              >
                Premium Cigars. Timeless Ritual.
              </div>
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: "rgba(242,238,227,0.82)",
                  maxWidth: 720
                }}
              >
                Luxury cigars, private drops, gifting, lounge culture, and collector-grade releases built for presence.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28%",
              borderRadius: 32,
              border: "1px solid rgba(200,148,52,0.24)",
              background: "linear-gradient(180deg, rgba(17,13,12,0.75), rgba(8,8,8,0.9))"
            }}
          >
            <img src={logo} alt="YISOS logo" width="300" height="300" />
          </div>
        </div>
      </div>
    ),
    size
  );
}
