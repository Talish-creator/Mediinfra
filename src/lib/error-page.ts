export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>MediInfra — Diagnostic Exception</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F6F8FC; color: #0F172A; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2.5rem; background: #FFFFFF; border: 1px solid rgba(15,23,42,0.08); border-radius: 20px; box-shadow: 0 20px 50px rgba(2,6,23,0.08); }
      .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; margin-bottom: 1.25rem; }
      h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; color: #0F172A; }
      p { color: #64748B; margin: 0 0 1.75rem; font-size: 13.5px; line-height: 1.6; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.55rem 1.25rem; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: all 0.15s ease; }
      .primary { background: #2563EB; color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      .primary:hover { background: #1D4ED8; }
      .secondary { background: #FFFFFF; color: #0F172A; border-color: rgba(15,23,42,0.12); }
      .secondary:hover { background: #F8FAFC; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">● Telemetry Stream Interrupted</div>
      <h1>System Telemetry Offline</h1>
      <p>A diagnostic exception occurred while rendering the MediInfra console. Try refreshing the active session or return to the main command center.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Retry Connection</button>
        <a class="secondary" href="/">Command Center</a>
      </div>
    </div>
  </body>
</html>`;
}
