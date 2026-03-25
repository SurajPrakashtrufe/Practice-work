import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quick Blood",
    short_name: "QuickBlood",
    description: "Connect blood donors with patients and hospitals in real time.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    orientation: "portrait",
    categories: ["health", "medical"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any"      },
    ],
    shortcuts: [
      {
        name: "Request Blood",
        short_name: "Request",
        description: "Post an urgent blood request",
        url: "/dashboard/patient/request/new",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Emergency SOS",
        short_name: "SOS",
        description: "Send emergency SOS broadcast",
        url: "/dashboard/sos",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  }
}
