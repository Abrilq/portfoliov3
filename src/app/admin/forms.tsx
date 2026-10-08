"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ToolLogo, toolCatalog } from "@/lib/tool-icons";
import type { Certification, Experience, Profile, Project } from "@/lib/types";
import {
  certificationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
} from "@/lib/validation";
import {
  deleteContentAction,
  saveCertificationAction,
  saveExperienceAction,
  saveProfileAction,
  saveProjectAction,
  type ActionResult,
} from "./actions";
import type { z } from "zod";

type ProfileValues = z.infer<typeof profileSchema>;
type ExperienceValues = z.input<typeof experienceSchema>;
type ProjectValues = z.input<typeof projectSchema>;
type CertificationValues = z.input<typeof certificationSchema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="admin-field"><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}

function FormFeedback({ result }: { result: ActionResult }) {
  if (!result.error && !result.success) return null;
  return <p className={`form-feedback ${result.error ? "is-error" : "is-success"}`} role="status">{result.error ?? result.success}</p>;
}

function SaveButton({ label = "Save changes", busy }: { label?: string; busy?: boolean }) {
  return <button className="admin-save" type="submit" disabled={busy}><Save size={15} /> {busy ? "Saving…" : label}</button>;
}

function ToolsPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const selectedTools = value.split(",").map((item) => item.trim()).filter(Boolean);
  const normalizedSelected = new Set(selectedTools.map((item) => item.toLowerCase()));
  const matches = toolCatalog.filter((tool) => tool.name.toLowerCase().includes(query.trim().toLowerCase()));
  const matchingTools = matches.slice(0, 24);

  function toggleTool(name: string) {
    const nextTools = normalizedSelected.has(name.toLowerCase())
      ? selectedTools.filter((item) => item.toLowerCase() !== name.toLowerCase())
      : [...selectedTools, name];
    onChange(nextTools.join(", "));
  }

  return (
    <div className="tool-picker">
      <input
        aria-label="Search tools and technologies"
        className="tool-picker-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools and technologies"
        type="search"
        value={query}
      />
      {selectedTools.length > 0 && (
        <div className="tool-picker-selected" aria-label="Selected tools">
          {selectedTools.map((tool) => (
            <span className="tool-picker-chip" key={tool}>
              <ToolLogo name={tool} />
              {tool}
              <button aria-label={`Remove ${tool}`} onClick={() => toggleTool(tool)} type="button">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="tool-picker-results" role="group" aria-label="Tool options">
        {matchingTools.map((tool) => (
          <label className="tool-picker-option" key={tool.name}>
            <input
              checked={normalizedSelected.has(tool.name.toLowerCase())}
              onChange={() => toggleTool(tool.name)}
              type="checkbox"
            />
            <ToolLogo name={tool.name} />
            <span>{tool.name}</span>
          </label>
        ))}
        {matchingTools.length === 0 && <p className="tool-picker-empty">No matching tools found.</p>}
      </div>
      <span className="tool-picker-hint" role="status">
        {matches.length > matchingTools.length
          ? `Showing the first ${matchingTools.length} of ${matches.length} matches. Search to narrow the list.`
          : `${matches.length} matching ${matches.length === 1 ? "tool" : "tools"}.`}
        {` ${selectedTools.length} selected.`}
      </span>
    </div>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult>({});
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      role: profile.role,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      summary: profile.summary,
      availability: profile.availability,
      education_school: profile.education_school,
      education_degree: profile.education_degree,
      education_start: profile.education_start,
      education_end: profile.education_end,
      skills_text: profile.skills.join(", "),
    },
  });

  const submit = handleSubmit(async (values) => {
    const response = await saveProfileAction(values);
    setResult(response);
    if (response.success) router.refresh();
  });

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-grid">
        <Field label="Name" error={errors.name?.message}><input {...register("name")} /></Field>
        <Field label="Professional headline" error={errors.role?.message}>
          <input list="professional-headline-options" {...register("role")} />
          <datalist id="professional-headline-options">
            <option value="Frontend Developer" />
            <option value="Full-stack Developer" />
            <option value="Web Developer" />
            <option value="Software Developer" />
            <option value="IT Graduate" />
          </datalist>
        </Field>
        <Field label="Location" error={errors.location?.message}><input {...register("location")} /></Field>
        <Field label="Email" error={errors.email?.message}><input type="email" {...register("email")} /></Field>
        <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} /></Field>
        <Field label="Portfolio URL" error={errors.website?.message}><input type="url" {...register("website")} /></Field>
        <Field label="Availability"><input {...register("availability")} /></Field>
        <Field label="School"><input {...register("education_school")} /></Field>
        <Field label="Degree"><input {...register("education_degree")} /></Field>
        <Field label="Education start year"><input {...register("education_start")} /></Field>
        <Field label="Education end year"><input {...register("education_end")} /></Field>
      </div>
      <fieldset className="admin-field tool-picker-field">
        <legend>Skills and tools</legend>
        <Controller
          control={control}
          name="skills_text"
          render={({ field }) => <ToolsPicker value={field.value} onChange={field.onChange} />}
        />
      </fieldset>
      <Field label="Professional summary" error={errors.summary?.message}><textarea rows={5} {...register("summary")} /></Field>
      <div className="admin-form-actions"><FormFeedback result={result} /><SaveButton busy={isSubmitting} /></div>
    </form>
  );
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult>({});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      id: experience?.id ?? "",
      company: experience?.company ?? "",
      title: experience?.title ?? "",
      location: experience?.location ?? "",
      start_date: experience?.start_date.slice(0, 10) ?? "",
      end_date: experience?.end_date?.slice(0, 10) ?? "",
      highlights_text: experience?.highlights.join("\n") ?? "",
      sort_order: experience?.sort_order ?? 1,
      published: experience?.published ?? true,
    },
  });
  const submit = handleSubmit(async (values) => {
    const response = await saveExperienceAction(values);
    setResult(response);
    if (response.success) router.refresh();
  });

  return (
    <form className="admin-form collection-form" onSubmit={submit}>
      <input type="hidden" {...register("id")} />
      <div className="admin-form-grid">
        <Field label="Company or organization" error={errors.company?.message}><input {...register("company")} /></Field>
        <Field label="Job title" error={errors.title?.message}><input {...register("title")} /></Field>
        <Field label="Location"><input {...register("location")} /></Field>
        <Field label="Start date" error={errors.start_date?.message}><input type="date" {...register("start_date")} /></Field>
        <Field label="End date"><input type="date" {...register("end_date")} /></Field>
        <Field label="Display order"><input type="number" min="0" {...register("sort_order", { valueAsNumber: true })} /></Field>
      </div>
      <Field label="Highlights (one per line)"><textarea rows={5} {...register("highlights_text")} /></Field>
      <div className="admin-form-actions"><label className="admin-toggle"><input type="checkbox" {...register("published")} /> Published</label><FormFeedback result={result} /><SaveButton label={experience ? "Save experience" : "Add experience"} busy={isSubmitting} /></div>
    </form>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult>({});
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: project?.id ?? "",
      slug: project?.slug ?? "",
      title: project?.title ?? "",
      role: project?.role ?? "",
      year: project?.year ?? String(new Date().getFullYear()),
      category: project?.category ?? "",
      summary: project?.summary ?? "",
      body_html: project?.body_html ?? "<p></p>",
      stack_text: project?.stack.join(", ") ?? "",
      live_url: project?.live_url ?? "",
      repo_url: project?.repo_url ?? "",
      featured: project?.featured ?? false,
      sort_order: project?.sort_order ?? 1,
      published: project?.published ?? true,
    },
  });
  const submit = handleSubmit(async (values) => {
    const response = await saveProjectAction(values);
    setResult(response);
    if (response.success) router.refresh();
  });

  return (
    <form className="admin-form collection-form" onSubmit={submit}>
      <input type="hidden" {...register("id")} />
      <div className="admin-form-grid">
        <Field label="Project title" error={errors.title?.message}><input {...register("title")} /></Field>
        <Field label="URL slug" error={errors.slug?.message}><input placeholder="project-name" {...register("slug")} /></Field>
        <Field label="Your role" error={errors.role?.message}><input {...register("role")} /></Field>
        <Field label="Year" error={errors.year?.message}><input {...register("year")} /></Field>
        <Field label="Category" error={errors.category?.message}><input {...register("category")} /></Field>
        <Field label="Display order"><input type="number" min="0" {...register("sort_order", { valueAsNumber: true })} /></Field>
        <Field label="Live project URL" error={errors.live_url?.message}><input type="url" {...register("live_url")} /></Field>
        <Field label="Source repository URL" error={errors.repo_url?.message}><input type="url" {...register("repo_url")} /></Field>
        <Field label="Technologies / tags" error={errors.stack_text?.message}><input placeholder="React, TypeScript, Figma" {...register("stack_text")} /></Field>
      </div>
      <Field label="Short summary" error={errors.summary?.message}><textarea rows={3} {...register("summary")} /></Field>
      <Field label="Project body" error={errors.body_html?.message}><Controller control={control} name="body_html" render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />} /></Field>
      <div className="admin-form-actions"><label className="admin-toggle"><input type="checkbox" {...register("featured")} /> Feature on homepage</label><label className="admin-toggle"><input type="checkbox" {...register("published")} /> Published</label><FormFeedback result={result} /><SaveButton label={project ? "Save project" : "Add project"} busy={isSubmitting} /></div>
    </form>
  );
}

export function CertificationForm({ certification }: { certification?: Certification }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult>({});
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      id: certification?.id ?? "",
      title: certification?.title ?? "",
      issuer: certification?.issuer ?? "",
      year: certification?.year ?? String(new Date().getFullYear()),
      sort_order: certification?.sort_order ?? 1,
      published: certification?.published ?? true,
    },
  });
  const submit = handleSubmit(async (values) => {
    const response = await saveCertificationAction(values);
    setResult(response);
    if (response.success) router.refresh();
  });

  return (
    <form className="admin-form collection-form" onSubmit={submit}>
      <input type="hidden" {...register("id")} />
      <div className="admin-form-grid">
        <Field label="Certification" error={errors.title?.message}><input {...register("title")} /></Field>
        <Field label="Issuer" error={errors.issuer?.message}><input {...register("issuer")} /></Field>
        <Field label="Year" error={errors.year?.message}><input {...register("year")} /></Field>
        <Field label="Display order"><input type="number" min="0" {...register("sort_order", { valueAsNumber: true })} /></Field>
      </div>
      <div className="admin-form-actions"><label className="admin-toggle"><input type="checkbox" {...register("published")} /> Published</label><FormFeedback result={result} /><SaveButton label={certification ? "Save certification" : "Add certification"} busy={isSubmitting} /></div>
    </form>
  );
}

export function DeleteItem({ table, id, title }: { table: "experiences" | "projects" | "certifications"; id: string; title: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult>({});
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusy(true);
    const response = await deleteContentAction({ table, id });
    setResult(response);
    setBusy(false);
    if (response.success) router.refresh();
  }

  return <div className="delete-control"><button className="admin-delete" type="button" onClick={remove} disabled={busy}><Trash2 size={14} /> {busy ? "Deleting…" : "Delete"}</button><FormFeedback result={result} /></div>;
}

export function AddAnother({ label }: { label: string }) {
  return <h2 className="admin-subheading"><Plus size={17} /> {label}</h2>;
}