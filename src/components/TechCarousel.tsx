import { TECH } from "./tech-icons";

// Server component: the glyphs are defined once as <symbol>s and reused by both loop copies.
export function TechCarousel() {
  const items = TECH.map((t) => (
    <li key={t.slug}>
      <svg className="ti" viewBox="0 0 24 24" aria-hidden="true"><use href={`#ti-${t.slug}`} /></svg>
      <span className="mono">{t.label}</span>
    </li>
  ));
  return (
    <div className="tech" role="region" aria-label="Languages, frameworks and tools I have worked with">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        {TECH.map((t) => (
          <symbol id={`ti-${t.slug}`} viewBox="0 0 24 24" key={t.slug}><path d={t.d} /></symbol>
        ))}
      </svg>
      <div className="tech-track">
        <ul>{items}</ul>
        <ul aria-hidden="true">{items}</ul>
      </div>
    </div>
  );
}
