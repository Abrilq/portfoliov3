import { fallbackContent, personalProjects, supplementalProjects } from "@/lib/content";
import type { Certification, Experience, PortfolioContent, Profile, Project } from "@/lib/types";
import { getCurrentAdmin } from "@/lib/supabase/server";

export async function getAdminPortfolio(): Promise<PortfolioContent> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Admin access is required.");

  const [profileResult, experienceResult, projectResult, certificationResult] = await Promise.all([
    admin.supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
    admin.supabase.from("experiences").select("*").order("sort_order"),
    admin.supabase.from("projects").select("*").order("sort_order"),
    admin.supabase.from("certifications").select("*").order("sort_order"),
  ]);

  const defaultProjects = [...fallbackContent.projects, ...supplementalProjects, ...personalProjects];
  const storedProjects = ((projectResult.data as Project[] | null) ?? []).map((project) => {
    const defaults = defaultProjects.find((item) => item.slug === project.slug);
    return {
      ...project,
      project_type: project.project_type ?? defaults?.project_type ?? "case_study",
      media: project.media ?? defaults?.media ?? [],
    };
  });
  const storedSlugs = new Set(storedProjects.map((project) => project.slug));
  const allProjects = [...storedProjects, ...defaultProjects.filter((project) => !storedSlugs.has(project.slug))]
    .sort((left, right) => left.sort_order - right.sort_order);

  return {
    profile: (profileResult.data as Profile | null) ?? fallbackContent.profile,
    experiences: (experienceResult.data as Experience[] | null) ?? [],
    projects: allProjects.filter((project) => project.project_type !== "personal"),
    personalProjects: allProjects.filter((project) => project.project_type === "personal"),
    certifications: (certificationResult.data as Certification[] | null) ?? [],
  };
}