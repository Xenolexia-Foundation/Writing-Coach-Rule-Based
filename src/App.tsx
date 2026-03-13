import { Editor } from "@/ui/Editor";

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Writing Coach</h1>
        <p className="app-tagline">Offline, rule-based — Phase 1</p>
      </header>
      <main className="app-main">
        <Editor />
      </main>
    </div>
  );
}
