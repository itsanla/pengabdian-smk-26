import type { MetadataRoute } from "next";

const baseUrl = "https://smk2batusangkar.tech";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/komoditas/"],
        disallow: ["/dashboard/", "/login/", "/siswa/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
