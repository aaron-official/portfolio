import { EnterWorld } from "../components/EnterWorld";
import { Puzzle } from "../components/Puzzle";
import { ContactForm } from "../components/ContactForm";
import { LocalTime } from "../components/LocalTime";
import { LandingChat } from "../components/LandingChat";
import { TechCarousel } from "../components/TechCarousel";
import "./landing.css";

const WORK = [
  {
    title: "Swap Africa",
    status: "Live",
    summary: "Safer online buying and selling, with delivery",
    text: "Buying and selling online between strangers is risky for both sides. Swap holds the buyer's money safely, a rider delivers and photographs the item, and the seller is paid only when the buyer confirms receipt with a QR code. I built the whole platform: the system that handles the money, the web apps for sellers, buyers and admins, and the rider's phone app.",
    stack: ["Rust", "Next.js", "React Native", "PostgreSQL"],
    link: { href: "https://swapafrica.online", label: "swapafrica.online" },
  },
  {
    title: "broRacks",
    status: "Live",
    summary: "One connection to mobile-money payments",
    text: "Businesses that want to take mobile-money payments normally have to connect to several providers. broRacks lets them collect money from customers, and pay money out to phones and bank accounts, through one connection. I built it end to end, including merchant sign-up, self-service access keys, payment notifications and the deployment.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    link: { href: "https://broracks.online", label: "broracks.online" },
  },
  {
    title: "tvPay",
    status: "Live",
    summary: "Pay for satellite TV with mobile money",
    text: "An online shop where customers pay for satellite-TV subscriptions from their phone. I built it with safeguards so a customer can never be charged the wrong price or twice, every order tracked from payment to delivery, an admin dashboard, and automated tests on the payment paths.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker"],
    link: { href: "https://tvpay.app", label: "tvpay.app" },
  },
  {
    title: "SplitFair",
    status: "May — Sep 2026",
    summary: "Technical lead, Refactory apprenticeship team project",
    text: "A platform where brands and agencies hire creators, fund the contract up front, and the payment is split fairly between everyone who worked on it. It solves the \"who gets paid what, and when\" problem for creative work. I led a team of five and made the main technical decisions. I built the core system that holds, tracks and pays out the money, and led the background services that process media, deliver files and run checks. I also contributed to the web and mobile apps.",
    stack: ["Rust", "Python", "PostgreSQL", "Next.js", "React Native"],
    link: { href: "https://splitfair.africa", label: "splitfair.africa" },
  },
  {
    title: "JijiLens",
    status: "Live demo",
    summary: "Search for products with a photo",
    text: "Finding the product you saw in a photo is hard on a classifieds site. JijiLens lets you upload a photo, tap one item, and see similar listings from Jiji Uganda. I built it to collect 4,134 public listings politely, without storing seller names or phone numbers, to match photos by how they look, and to run as a live demo. The demo sleeps when idle, so the first visit takes about two minutes.",
    stack: ["Python", "PostgreSQL", "Image-search AI", "Docker"],
    link: { href: "https://jijilens.fly.dev", label: "jijilens.fly.dev" },
  },
  {
    title: "Mimic",
    status: "Experiment",
    summary: "Turns a coding tutorial into a working app",
    text: "Rebuilding an app by following a coding tutorial is slow. Mimic does it for you: AI agents watch the video, write the app and test it, and a supervisor steps in when one gets stuck. I designed and wrote the whole system. Open source on GitHub.",
    stack: ["Python", "LangGraph", "Google Gemini", "SQLite"],
    link: { href: "https://github.com/aaron-official/mimic", label: "github.com/aaron-official/mimic" },
  },
  {
    title: "General elections",
    status: "Jan — Feb 2026",
    summary: "Electoral Commission Presiding Officer",
    text: "Ran a polling station and led its team of polling assistants through election day. The fingerprint voter-check machines failed, materials arrived late and riots broke out, so I switched to the paper register, kept order and protected the secrecy of the vote. After closing, I counted in front of party agents and the public, recorded the results on the official form and handed over every ballot. The job was leadership and steady decisions under pressure.",
    stack: ["Leadership", "Accuracy", "Neutrality"],
    link: null,
  },
];

// drawn as an SVG so phones can't swap the glyph for a colour emoji
function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square">
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}

const STACK = ["Python", "TypeScript", "Rust", "FastAPI", "Next.js / React", "PostgreSQL", "Supabase", "Docker", "LangGraph", "CrewAI"];

export default function Home() {
  return (
    <div className="lite">
      <header className="bar mono">
        <div>Aaron <br />Kakembo</div>
        <nav>
          <a href="#work">Work</a><br />
          <a href="#contact">Contact</a>
        </nav>
        <div>Kampala, UG<br /><span className="coords">0.35° N 32.58° E</span></div>
        <div className="clock"><i aria-hidden="true" /> <LocalTime /></div>
      </header>

      <section className="hero">
        <Puzzle className="pz" />
        <h1 aria-label="Aaron Kakembo">
          <span className="line"><span>Aaron</span></span>
          <span className="line"><span><em>Kakembo</em></span></span>
        </h1>
        <div className="hero-foot">
          <p className="statement">
            I build software that <em>moves money</em> and AI that <em>does the work</em>, taking ideas from the paper all the way to production.
          </p>
          <ul className="mono roles">
            <li>Software Engineer</li>
            <li>Fintech Systems</li>
            <li>Full-Stack</li>
            <li>AI Engineer</li>
          </ul>
          <div className="scroll mono">Scroll ↓︎</div>
        </div>
      </section>

      <section className="tools">
        <div className="sec-head mono">
          <span>Tools</span>
          <span>(Worked with)</span>
        </div>
        <TechCarousel />
      </section>

      <section id="work" className="work">
        <div className="sec-head mono">
          <span>Selected work</span>
          <span>({String(WORK.length).padStart(2, "0")})</span>
        </div>
        <ol className="rows">
          {WORK.map((w, i) => (
            <li className="row" key={w.title} tabIndex={0}>
              <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
              <h3>{w.title}</h3>
              <span className="when mono">{w.status}</span>
              <div className="more">
                <div>
                  <p className="role mono">{w.summary}</p>
                  <p>{w.text}</p>
                  <p className="tags mono">
                    {w.stack.join(" / ")}
                    {w.link && (
                      <a className="proj-link" href={w.link.href} target="_blank" rel="noopener noreferrer">{w.link.label} ↗︎</a>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="about" className="about">
        <div className="sec-head mono">
          <span>About</span>
          <span>(Stack)</span>
        </div>
        <div className="about-grid">
          <div>
          <p className="big">
            Fascinated by <em>greatness</em>, and set on being one of the greats. I always study something
            new on the side, play chess, and have shipped software since 2021, mostly <em>payments</em> and AI.
          </p>
          <p className="mono heroes">Looking up to Linus Torvalds, Elon Musk, Steve Jobs and Satoshi Nakamoto.</p>
          </div>
          <ol className="stack mono">
            {STACK.map((s, i) => (
              <li key={s}><span>{String(i + 1).padStart(2, "0")}</span>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="enter" className="portal-wrap">
        <EnterWorld className="portal">
          <span className="mono">Wi-Fi recommended · ~3 MB of pure fun</span>
          <span className="portal-title">Enter my <em>island</em> <b aria-hidden="true"><Arrow /></b></span>
        </EnterWorld>
      </section>

      <section id="contact" className="contact">
        <div className="sec-head mono">
          <span>Contact</span>
          <span>(Form)</span>
        </div>
        <h2>Say <em>hello.</em></h2>
        <div className="contact-body">
          <div className="contact-wrap">
            <ContactForm showSocials={false} />
          </div>
          <div className="connect-col">
          <a className="connect" href="https://www.linkedin.com/in/aaron-kakembo-468042321/" target="_blank" rel="noopener noreferrer">
            <span className="mono">Allergic to forms? Same</span>
            <span className="connect-title">Connect on <em>LinkedIn</em> <b aria-hidden="true"><Arrow /></b></span>
          </a>
          <a className="connect" href="https://www.chess.com/play/aar-on_bro" target="_blank" rel="noopener noreferrer">
            <span className="mono">Think you can win?</span>
            <span className="connect-title">Challenge me at <em>chess</em> <b aria-hidden="true"><Arrow /></b></span>
          </a>
          </div>
        </div>
      </section>

      <footer id="footer" className="foot mono">
        <span>© {new Date().getFullYear()} Aaron Kakembo</span>
        <span className="foot-links">
          <a href="/aaron-kakembo.pdf" download="Aaron-Kakembo-CV.pdf">Download CV ↓︎</a>
          <a href="https://github.com/aaron-official/" target="_blank" rel="noopener noreferrer">GitHub ↗︎</a>
        </span>
      </footer>
      <LandingChat />
    </div>
  );
}
