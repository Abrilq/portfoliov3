import { unstable_cache } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { fallbackContent, personalProjects, supplementalProjects } from "@/lib/content";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Certification, Experience, PortfolioContent, Profile, Project } from "@/lib/types";

const readCachedPortfolio = unstable_cache(
  async (): Promise<PortfolioContent> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return fallbackContent;

    const [profileResult, experienceResult, projectResult, certificationResult] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("experiences").select("*").eq("published", true).order("sort_order"),
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("certifications").select("*").eq("published", true).order("sort_order"),
    ]);

    const projects = (projectResult.data as Project[] | null)?.map((project) => ({ ...project, body_html: sanitizeHtml(project.body_html) }));
    const availableProjects = projects ?? fallbackContent.projects;
    const combinedProjects = [
      ...availableProjects,
      ...supplementalProjects.filter((supplemental) => !availableProjects.some((project) => project.slug === supplemental.slug)),
    ].sort((left, right) => left.sort_order - right.sort_order);

    return {
      profile: (profileResult.data as Profile | null) ?? fallbackContent.profile,
      experiences: (experienceResult.data as Experience[] | null) ?? fallbackContent.experiences,
      projects: combinedProjects,
      certifications: (certificationResult.data as Certification[] | null) ?? fallbackContent.certifications,
    };
  },
  ["portfolio-content"],
  { revalidate: 300, tags: ["portfolio-content"] },
);

export function getPortfolioContent() {
  return readCachedPortfolio();
}

export async function getPortfolioProject(slug: string) {
  const content = await getPortfolioContent();
  return content.projects.find((project) => project.slug === slug)
    ?? personalProjects.find((project) => project.slug === slug)
    ?? null;
}