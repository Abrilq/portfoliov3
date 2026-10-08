import { unstable_cache } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { fallbackContent, supplementalProjects } from "@/lib/content";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Certification, Experience, PortfolioContent, Profile, Project } from "@/lib/types";

const readCachedPortfolio = unstable_cache(
  async (): Promise<PortfolioContent> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return {
      ...fallbackContent,
      projects: [...fallbackContent.projects, ...supplementalProjects],
    };

    const [profileResult, experienceResult, projectResult, certificationResult] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("experiences").select("*").eq("published", true).order("sort_order"),
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("certifications").select("*").eq("published", true).order("sort_order"),
    ]);

    const defaultProjects = [...fallbackContent.projects, ...supplementalProjects, ...fallbackContent.personalProjects];
    const loadedProjects = (projectResult.data as Project[] | null)?.map((project) => {
      const defaults = defaultProjects.find((item) => item.slug === project.slug);
      return {
        ...project,
        body_html: sanitizeHtml(project.body_html),
        project_type: project.project_type ?? defaults?.project_type ?? "case_study",
        media: project.media ?? defaults?.media ?? [],
      };
    }) ?? [...fallbackContent.projects, ...supplementalProjects, ...fallbackContent.personalProjects];

    return {
      profile: (profileResult.data as Profile | null) ?? fallbackContent.profile,
      experiences: (experienceResult.data as Experience[] | null) ?? fallbackContent.experiences,
      projects: loadedProjects.filter((project) => project.project_type !== "personal").sort((left, right) => left.sort_order - right.sort_order),
      personalProjects: loadedProjects.filter((project) => project.project_type === "personal").sort((left, right) => left.sort_order - right.sort_order),
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
    ?? content.personalProjects.find((project) => project.slug === slug)
    ?? null;
}