import { ImageResponse } from "next/og";
import { getAssetDataUrl } from "@/lib/seo/brand-assets";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default async function Icon() {
  const logo = await getAssetDataUrl("yisos-logo.png");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent"
        }}
      >
        <img src={logo} alt="YISOS logo" width="60" height="60" />
      </div>
    ),
    size
  );
}
