"use client";

// Last line of defence: without this, an uncaught error leaves the browser's default white page.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#0e0e0c", color: "#ebe7dc", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 20, marginBottom: 16 }}>Something went wrong loading the page.</p>
          <button onClick={reset} style={{ padding: "10px 18px", border: "1px solid #ebe7dc", background: "transparent", color: "inherit", cursor: "pointer", font: "inherit" }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
