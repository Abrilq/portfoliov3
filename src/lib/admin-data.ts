import { fallbackProfile } from "@/lib/content";
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

  return {
    profile: (profileResult.data as Profile | null) ?? fallbackProfile,
    experiences: (experienceResult.data as Experience[] | null) ?? [],
    projects: (projectResult.data as Project[] | null) ?? [],
    certifications: (certificationResult.data as Certification[] | null) ?? [],
  };
}