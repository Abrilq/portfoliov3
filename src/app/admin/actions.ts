"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import type { ProjectMedia } from "@/lib/types";
import { certificationSchema, deleteContentSchema, experienceSchema, profileSchema, projectSchema } from "@/lib/validation";
import { createSupabaseServerClient, getCurrentAdmin } from "@/lib/supabase/server";

export type ActionResult = { success?: string; error?: string };

function refreshPortfolio() {
  revalidateTag("portfolio-content", "max");
  revalidatePath("/", "page");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/admin", "layout");
}

async function adminClient() {
  try {
    return (await getCurrentAdmin())?.supabase ?? null;
  } catch {
    return null;
  }
}

export async function signInAdmin(email: string, password: string): Promise<ActionResult> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return { error: "Add your Supabase URL and public key before signing in." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Email or password was not accepted." };
  if (data.user.app_metadata.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account does not have portfolio admin access." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProfileAction(input: unknown): Promise<ActionResult> {
  const supabase = await adminClient();
  if (!supabase) return { error: "Admin access is required." };
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the profile fields." };

  const { skills_text, ...profile } = parsed.data;
  const { error } = await supabase.from("profile").upsert({
    id: 1,
    ...profile,
    skills: skills_text.split(",").map((item) => item.trim()).filter(Boolean),
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };
  refreshPortfolio();
  return { success: "Profile saved." };
}

export async function saveExperienceAction(input: unknown): Promise<ActionResult> {
  const supabase = await adminClient();
  if (!supabase) return { error: "Admin access is required." };
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the experience fields." };

  const { highlights_text, end_date, ...values } = parsed.data;
  const { error } = await supabase.from("experiences").upsert({
    ...values,
    end_date: end_date || null,
    highlights: highlights_text.split("\n").map((item) => item.trim()).filter(Boolean),
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };
  refreshPortfolio();
  return { success: "Experience saved." };
}

export async function saveProjectAction(input: unknown): Promise<ActionResult> {
  const supabase = await adminClient();
  if (!supabase) return { error: "Admin access is required." };
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the project fields." };

  const { id, body_html, stack_text, media, ...values } = parsed.data;
  const previousResult = id
    ? await supabase.from("projects").select("media").eq("id", id).maybeSingle()
    : await supabase.from("projects").select("media").eq("slug", values.slug).maybeSingle();
  if (previousResult.error) return { error: previousResult.error.message };

  const { error } = await supabase.from("projects").upsert({
    ...(id ? { id } : {}),
    ...values,
    body_html: sanitizeHtml(body_html),
    stack: stack_text.split(",").map((item) => item.trim()).filter(Boolean),
    media,
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });
  if (error) return { error: error.message };
  refreshPortfolio();
  const savedPaths = new Set(media.map((item) => item.path));
  const removedPaths = ((previousResult.data?.media as ProjectMedia[] | null) ?? [])
    .map((item) => item.path)
    .filter((path) => !savedPaths.has(path));
  if (removedPaths.length > 0) {
    const { error: cleanupError } = await supabase.storage.from("project-media").remove(removedPaths);
    if (cleanupError) return { error: `Project saved, but removed media could not be cleaned up: ${cleanupError.message}` };
  }
  return { success: "Project saved." };
}

export async function saveCertificationAction(input: unknown): Promise<ActionResult> {
  const supabase = await adminClient();
  if (!supabase) return { error: "Admin access is required." };
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the certification fields." };

  const { error } = await supabase.from("certifications").upsert({ ...parsed.data, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  refreshPortfolio();
  return { success: "Certification saved." };
}

export async function deleteContentAction(input: unknown): Promise<ActionResult> {
  const supabase = await adminClient();
  if (!supabase) return { error: "Admin access is required." };
  const parsed = deleteContentSchema.safeParse(input);
  if (!parsed.success) return { error: "The selected item could not be deleted." };

  let mediaPaths: string[] = [];
  if (parsed.data.table === "projects") {
    const projectResult = await supabase.from("projects").select("media").eq("id", parsed.data.id).maybeSingle();
    if (projectResult.error) return { error: projectResult.error.message };
    mediaPaths = ((projectResult.data?.media as ProjectMedia[] | null) ?? []).map((item) => item.path);
  }

  const { error } = await supabase.from(parsed.data.table).delete().eq("id", parsed.data.id);
  if (error) return { error: error.message };
  refreshPortfolio();
  if (mediaPaths.length > 0) {
    const { error: cleanupError } = await supabase.storage.from("project-media").remove(mediaPaths);
    if (cleanupError) return { error: `Item deleted, but its media could not be cleaned up: ${cleanupError.message}` };
  }
  return { success: "Item deleted." };
}