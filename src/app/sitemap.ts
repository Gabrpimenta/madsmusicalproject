import type { MetadataRoute } from "next";
import { site } from "@/lib/site-content";

export const dynamic = "force-static";

const routes = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/cursos/",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/professores/",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/ingressos/",
    changeFrequency: "weekly",
    priority: 0.8,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2026-07-11";

  return routes.map((route) => ({
    url: new URL(route.path, site.url).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
