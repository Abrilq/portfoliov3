import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ setup?: string }> }) {
  const { setup } = await searchParams;

  return (
    <main className="login-screen">
      <div className="login-panel">
        <Link className="login-back" href="/"><ArrowLeft size={15} /> Portfolio</Link>
        <p className="eyebrow">CL / Content studio</p>
        <h1>Sign in to<br /><em>your workspace.</em></h1>
        <p className="login-copy">Manage your profile, work, and credentials.</p>
        {setup && <p className="login-setup-note">Add the Supabase URL and public key from `.env.example` to your local environment, then apply `schema.sql` in the Supabase SQL editor.</p>}
        <AdminLoginForm />
      </div>
      <div className="login-art" aria-hidden="true"><span>01</span><div><b>Good work<br />keeps moving.</b><i>CL / PH</i></div></div>
    </main>
  );
}