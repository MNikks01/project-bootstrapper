"use client";

import { useState } from "react";

type Result = { name: string; template: string; files: Record<string, string>; fileCount: number; features: string[] };

const TEMPLATES = ["ai-saas", "node-service", "mcp-server"];
const FEATURES = ["auth", "billing", "rag", "mcp", "docker", "ci"];

export default function Home() {
  const [name, setName] = useState("my-app");
  const [template, setTemplate] = useState("ai-saas");
  const [features, setFeatures] = useState<Set<string>>(new Set(["auth", "mcp", "ci"]));
  const [result, setResult] = useState<Result | null>(null);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  function toggle(f: string) {
    const next = new Set(features);
    next.has(f) ? next.delete(f) : next.add(f);
    setFeatures(next);
  }

  async function generate() {
    setError("");
    setBusy("gen");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, template, features: [...features] }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error?.message ?? "Failed");
      setResult(d);
      setOpenFile(Object.keys(d.files)[0] ?? null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  async function download() {
    setBusy("zip");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, template, features: [...features] }),
      });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${result?.name ?? "app"}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Project Bootstrapper</h1>
      <p className="mt-2 text-zinc-500">
        Generate a production-ready, AI-agent-ready project — code + <code>CLAUDE.md</code>/<code>AGENTS.md</code>/
        <code>mcp.json</code> + CI + Docker. Pick a template and features, preview, download.
      </p>

      <section className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="project name" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            {TEMPLATES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          {FEATURES.map((f) => (
            <label key={f} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={features.has(f)} onChange={() => toggle(f)} />
              {f}
            </label>
          ))}
        </div>
        <button onClick={generate} disabled={busy === "gen"} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">
          {busy === "gen" ? "Generating…" : "Generate"}
        </button>
      </section>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {result && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {result.name} · {result.template} · {result.fileCount} files
            </h2>
            <button onClick={download} disabled={busy === "zip"} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              {busy === "zip" ? "Zipping…" : "Download ZIP"}
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500">features: {result.features.join(", ") || "none"}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="rounded-md border border-zinc-200 p-2 text-xs dark:border-zinc-800">
              {Object.keys(result.files).map((p) => (
                <button key={p} onClick={() => setOpenFile(p)} className={`block w-full truncate rounded px-2 py-1 text-left font-mono ${openFile === p ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}>
                  {p}
                </button>
              ))}
            </div>
            <pre className="max-h-96 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
              {openFile ? result.files[openFile] : "Select a file"}
            </pre>
          </div>
        </section>
      )}
    </main>
  );
}
