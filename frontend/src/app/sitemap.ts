import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://famousmobiles.com";

  const staticRoutes = [
    "",
    "/services",
    "/book-repair",
    "/track-booking",
    "/mobile-repair-manikonda",
    "/mobile-repair-shaikpet-puppalaguda",
    "/doorstep-mobile-repair-gachibowli",
    "/mobile-repair-tolichowki",
    "/mobile-repair-narsingi-kokapet",
    "/about",
    "/contact",
    "/faq",
    "/reviews",
    "/warranty",
    "/privacy",
    "/terms",
  ];

  const serviceSlugs = [
    "display-replacement",
    "battery-replacement",
    "charging-port-repair",
    "software-repair",
    "hardware-repair",
    "water-damage-diagnosis",
  ];

  const now = new Date();

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let priority = 0.8;
    if (route === "") priority = 1.0;
    else if (route.startsWith("/mobile-repair") || route.startsWith("/doorstep") || route === "/book-repair") priority = 0.9;

    return {
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority,
    };
  });

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...routes, ...serviceRoutes];
}
