import { ProfileForm } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminResumeDetailsPage() {
  const { profile } = await getAdminPortfolio();
  return <div className="admin-page"><div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / resume</p><h1>Resume details</h1></div><p>Edit your personal details, headline, summary, education, and skills. Work roles are managed under Experience.</p></div><section className="admin-panel"><ProfileForm profile={profile} /></section></div>;
}
