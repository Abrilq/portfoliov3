"use client";

import { useState, useTransition } from "react";
import { signInAdmin } from "../actions";

export function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [busy, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("");
    startTransition(async () => {
      const result = await signInAdmin(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
      if (result.error) setMessage(result.error);
    });
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>Email address<input name="email" type="email" autoComplete="username" required /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {message && <p className="login-error" role="alert">{message}</p>}
      <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}