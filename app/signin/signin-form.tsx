"use client";
import { useState } from "react";

export default function SignInForm({ returnTo }: { returnTo: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, returnTo }) });
      const result = await response.json();
      if (response.ok) { window.location.href = result.redirect || "/account"; return; }
      if (result.needsSetupCode) setNeedsCode(true);
      setError(result.error || "No se pudo completar la solicitud");
    } catch { setError("Error de conexión"); }
    setBusy(false);
  }

  return (
    <form className="authForm" onSubmit={submit}>
      {mode === "register" && <label>Nombre<input name="name" autoComplete="name" maxLength={120} /></label>}
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Contraseña<input name="password" type="password" required minLength={mode === "register" ? 10 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} /></label>
      {mode === "register" && needsCode && <label>Código de configuración<input name="setupCode" autoComplete="off" /></label>}
      {error && <p className="authError" role="alert">{error}</p>}
      <button className="signinAction" type="submit" disabled={busy}>{busy ? "Un momento…" : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</button>
      <button type="button" className="authSwitch" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
        {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </form>
  );
}
