import { ProfileForm } from "../forms";
import { getAdminPortfolio } from "@/lib/admin-data";

export default async function AdminProfilePage() {
  const { profile } = await getAdminPortfolio();
  return <div className="admin-page"><div className="admin-page-heading compact-admin-heading"><div><p className="eyebrow">Content / profile</p><h1>Profile details</h1></div><p>These details shape your introduction and contact links.</p></div><section className="admin-panel"><ProfileForm profile={profile} /></section></div>;
}