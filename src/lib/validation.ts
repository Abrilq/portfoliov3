import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  role: z.string().trim().min(2, "Enter a role or headline."),
  location: z.string().trim().min(2, "Enter a location."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim(),
  website: z.url("Enter a valid URL.").or(z.literal("")),
  summary: z.string().trim().min(10, "Add a little more detail."),
  availability: z.string().trim(),
  education_school: z.string().trim(),
  education_degree: z.string().trim(),
  education_start: z.string().trim(),
  education_end: z.string().trim(),
  skills_text: z.string(),
});

const optionalId = z.string().optional().transform((value) => value || undefined);

export const experienceSchema = z.object({
  id: optionalId,
  company: z.string().trim().min(2),
  title: z.string().trim().min(2),
  location: z.string().trim(),
  start_date: z.string().min(10),
  end_date: z.string(),
  highlights_text: z.string(),
  sort_order: z.coerce.number().int().min(0),
  published: z.boolean(),
});

export const projectSchema = z.object({
  id: optionalId,
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  title: z.string().trim().min(2),
  role: z.string().trim().min(2),
  year: z.string().trim().min(4),
  category: z.string().trim().min(2),
  summary: z.string().trim().min(10),
  body_html: z.string().min(3),
  stack_text: z.string(),
  live_url: z.url("Enter a valid URL.").or(z.literal("")),
  repo_url: z.url("Enter a valid URL.").or(z.literal("")),
  featured: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
  published: z.boolean(),
});

export const certificationSchema = z.object({
  id: optionalId,
  title: z.string().trim().min(2),
  issuer: z.string().trim().min(2),
  year: z.string().trim().min(4),
  sort_order: z.coerce.number().int().min(0),
  published: z.boolean(),
});

export const deleteContentSchema = z.object({
  table: z.enum(["experiences", "projects", "certifications"]),
  id: z.uuid(),
});