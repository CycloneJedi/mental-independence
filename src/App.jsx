import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const WEEKS = [
  {
    number: 1, title: "SEE THE BOX", subtitle: "You can't exit a framework you can't see",
    color: "#8B6914", accent: "#C9A84C",
    description: "Audit the installed beliefs. Map the boundary cognition. This week is diagnostic: no changing anything yet, just seeing clearly. The goal is honest inventory, not self-attack.",
    logic: "Awareness precedes change. Most people skip this stage and go straight to motivation. The result is effort applied to the wrong problem. Week 1 slows you down on purpose."
  },
  {
    number: 2, title: "INTERROGATE", subtitle: "Separate chosen from inherited",
    color: "#6B3A6B", accent: "#A855A8",
    description: "Stress-test what you found. Question origins. Identify what you're defending and why. The goal is honest reckoning. Not self-attack, not self-excuse.",
    logic: "Naming a belief isn't enough. You have to trace it back to its source and measure it against actual evidence. Most deeply held limiting beliefs survive on selective memory, not data."
  },
  {
    number: 3, title: "EXPOSE", subtitle: "The right audience is where you've been hiding",
    color: "#1A5C4A", accent: "#2ECC8E",
    description: "Small deliberate acts of visibility. Incremental exposure to the rooms that actually matter. The nervous system updates on outcomes, not intentions. This week generates the evidence.",
    logic: "Fear calibration is almost always worse than reality. The only proof of that is contact with reality. Week 3 creates that contact, deliberately and incrementally."
  },
  {
    number: 4, title: "INSTALL", subtitle: "Build what you want to keep",
    color: "#1A3A5C", accent: "#4A9EDB",
    description: "Consciously construct the new operating logic. Not aspirational — descriptive. The identity that survives scrutiny is the one worth keeping.",
    logic: "Identity without structure degrades under pressure. The old identity was self-sustaining because it had infrastructure. The new one needs the same: conscious, provisional, individually constructed."
  }
];

const DAYS = [
  // Week 1
  { day: 1, week: 1, prompt: "Write down 5 beliefs you hold about what's 'realistic' for you.", depth: "Trace each one back. Where did it come from? A parent, a failure, a teacher, a moment? Be specific: not 'society' but an actual source. Vague origins protect the belief. Precise origins expose it.", action: "Write the 5 beliefs and their origins. Don't edit or defend them yet. Just map." },
  { day: 2, week: 1, prompt: "What's a question you've always wanted to ask but felt somehow wasn't allowed?", depth: "The prohibition is the data. Questions that feel dangerous or embarrassing to ask reveal exactly where boundary cognition is operating. The discomfort isn't a signal to stop. It's the signal to pay attention.", action: "Ask the question fully, without softening it. Then write: who benefits if you don't ask it?" },
  { day: 3, week: 1, prompt: "Identify one area of your life where your behaviour is fully automatic.", depth: "Automatic behaviour is installed behaviour. You're not choosing it. You're running a program. The goal today is just to notice one. Observation before intervention.", action: "Name the automatic pattern. Describe what triggers it and what it produces. No judgment. Just observation." },
  { day: 4, week: 1, prompt: "Who has had the most influence over how you see yourself?", depth: "Not 'who do you respect.' Who shaped your internal narrator. The voice that tells you what you're worth, what's appropriate, what's too much. That voice had an author.", action: "Name them. Describe the specific model of you they hold. Did you choose to give them that authority?" },
  { day: 5, week: 1, prompt: "What's something you've told yourself you 'can't' do, but have never actually tested?", depth: "There's a difference between 'I tried and failed' and 'I assumed I'd fail so I never tried.' The second one is a ghost belief. It has no real evidence base. It survives because it's never been challenged.", action: "Name the untested 'can't.' Then write: what would actually happen if you tested it?" },
  { day: 6, week: 1, prompt: "Where in your life are you most predictable? Is that chosen or installed?", depth: "Predictability isn't the enemy. Unconscious predictability is. The question isn't whether you're consistent, but whether you consciously chose the consistency or inherited it.", action: "Identify two areas of high predictability. Mark each: Chosen or Installed. What would it look like to consciously re-choose?" },
  { day: 7, week: 1, prompt: "Week 1 review: which belief you found this week is the most load-bearing?", depth: "One belief is doing more work than the others. It's underpinning multiple behaviours, multiple self-imposed limits. Find it. The load-bearing belief is the one that, if removed, would require the most reconstruction.", action: "Name the load-bearing belief. Then write: what would concretely change in my life if this belief were wrong?", isIntegration: true },

  // Week 2
  { day: 8, week: 2, prompt: "Take your most limiting belief from Week 1. What evidence actually supports it?", depth: "Not feelings — evidence. Specific events. Then list what contradicts it. Most deeply held limiting beliefs survive on selective memory, not actual data. Make both lists equally ruthless.", action: "Two columns: Evidence For / Evidence Against. Be honest on both sides." },
  { day: 9, week: 2, prompt: "Who benefited when you adopted your fear-based identity?", depth: "Not necessarily through malice. Fearful, small-thinking people are easier to manage, easier to predict, less likely to leave or challenge. Someone or something found that useful. Even if unconsciously.", action: "Name who or what was served by your smaller self. This isn't about blame. It's about understanding the system you were part of." },
  { day: 10, week: 2, prompt: "What do you tell yourself about why you're not further ahead?", depth: "Listen carefully to the answer. Is it an explanation or a defense? An explanation is neutral analysis. A defense is a story that protects you from having to try harder. The difference is usually detectable in how quickly the answer comes.", action: "Write the story. Then label each element: True fact / Partial truth / Defense mechanism." },
  { day: 11, week: 2, prompt: "Which of your values are truly yours, and which are reactions against someone else's?", depth: "Reactive values are still installed values, just in the opposite direction. If you chose abundance because someone else chose scarcity, abundance might still be their legacy, not your choice. Chosen-against is not the same as chosen-for.", action: "List 5 core values. For each: Is this chosen because it's true for me, or because it opposes something I rejected?" },
  { day: 12, week: 2, prompt: "If you had no history, no past failures, no old version of yourself, what would you attempt?", depth: "The gap between this answer and what you're currently pursuing is the tax the old identity is still charging you. Be specific. Vague aspirations don't produce useful data.", action: "Write the answer fully. Then write: what is actually stopping me from attempting this now?" },
  { day: 13, week: 2, prompt: "What belief do you defend most vigorously when challenged?", depth: "Defensiveness is a signal, not evidence of truth. The beliefs that need the most defending are usually doing the most emotional work. They're protecting something underneath them. Find what's underneath.", action: "Name the belief. Ask: what would I have to face if this belief weren't true? That's what it's actually protecting." },
  { day: 14, week: 2, prompt: "Week 2 review: what is the single biggest lie the old identity told you about who you are?", depth: "Not a mistake, not a misunderstanding — a lie. Specifically a belief about your own capacity, worth, or ceiling that was never actually true. Say it plainly.", action: "Write it as a statement: 'The lie was: ___.' Then write its opposite as a present-tense fact. Say it out loud.", isIntegration: true },

  // Week 3
  { day: 15, week: 3, prompt: "Name the audience you've been avoiding.", depth: "The right audience is the people whose opinion would actually mean something. Because they'd actually know. That's exactly why they're terrifying. The wrong audience is safe because their opinion is easy to dismiss.", action: "Name them specifically. Then write: what am I afraid they'll say? What am I afraid they'll see?" },
  { day: 16, week: 3, prompt: "What's the smallest possible version of showing up to that audience?", depth: "Minimum viable exposure. Not the full vision, not the complete pitch. Just one real signal sent in the right direction. The goal is breaking the avoidance pattern, not winning immediately. Small and real beats large and imagined.", action: "Define the smallest act. Do it today. Write what you predicted would happen versus what actually happened." },
  { day: 17, week: 3, prompt: "Where are you still performing for the wrong room? What are you getting from it?", depth: "The wrong audience isn't just a mistake. It's a function. You're getting something from it: validation that feels safe, a stage with no real stakes, a way to feel active without real risk. Name the payoff honestly.", action: "Name one wrong-room performance. Identify the payoff. Then ask: is that payoff worth the cost of staying small?" },
  { day: 18, week: 3, prompt: "Tell one person — the right kind of person — something real about where you're going.", depth: "Not a rehearsed pitch. Something honest and specific about the version of yourself you're building toward. Then observe the gap between your prediction of their reaction and the actual reaction. That gap is your fear calibration error.", action: "Have the conversation. Afterward: what did I predict? What actually happened? What does that tell me?" },
  { day: 19, week: 3, prompt: "What would you put into the world today if you knew you wouldn't be judged for 30 days?", depth: "This isn't hypothetical. It's diagnostic. The answer reveals exactly what the fear of judgment is costing you right now, in concrete terms. The fear has a price. Make that price visible.", action: "Write the specific thing. Then ask: what's the actual worst case if I did this with judgment in play? Is that worse than more days of not doing it?" },
  { day: 20, week: 3, prompt: "Catch one moment today where fear filtered what you said or did.", depth: "You're not trying to eliminate the filter yet. Just observe it in real time. Noticing the edit as it happens is a different skill than noticing it after the fact. It requires a level of self-observation most people never develop.", action: "Name the moment: what you said/did, what the unfiltered version would have been, and what drove the edit." },
  { day: 21, week: 3, prompt: "Week 3 review: what did you survive this week that you were afraid of?", depth: "This is evidence accumulation. The nervous system updates on outcomes, not intentions. Every survived exposure rewrites the threat assessment. But only if you make the outcome visible and explicit.", action: "List what you did that scared you. For each: what did I predict? What happened? Your fear calibration is almost certainly worse than reality.", isIntegration: true },

  // Week 4
  { day: 22, week: 4, prompt: "Write the operating principles of your new identity.", depth: "Not aspirational goals. Descriptive principles. Not 'I want to be bold' but 'I move toward discomfort when it leads somewhere real.' Present tense. Behavioural. Testable. If you can't describe a concrete example from this week, it's still a goal. Not an installed principle.", action: "Write 5–7 principles. For each, write one example of that principle in action this week. If you can't, it's not installed yet." },
  { day: 23, week: 4, prompt: "What does success mean to you when no one is watching and no one is validating?", depth: "Strip away the audience entirely. No one will ever know. What do you still want? That's the signal. The rest is noise with a story attached. The gap between this answer and your daily optimization tells you something important.", action: "Write the answer. Then compare it to what you're actually optimising for day to day. Where's the gap?" },
  { day: 24, week: 4, prompt: "Design your ideal audience: the people whose opinion you actually want to earn.", depth: "Not everyone. Specific people. What do they value? What would they have to see from you to take you seriously? Are you currently building toward them or away from them?", action: "Describe 3 people or a specific type of person. Then ask: what would I do differently this month to move toward their attention?" },
  { day: 25, week: 4, prompt: "Where is the new identity still fragile?", depth: "Every identity has load-bearing points. The new one has them too. Knowing where it's fragile lets you reinforce it deliberately rather than discovering the weakness under pressure. Which is always the worst time to find it.", action: "Name two scenarios that would most test the new identity. What would the old identity do? What does the new one do? Is that response actually available to you yet?" },
  { day: 26, week: 4, prompt: "What are you willing to be laughed at for?", depth: "This is the real test. Not 'what am I willing to try.' That's still comfortable. What specific thing will you pursue even if people whose opinion you once needed find it ridiculous? The answer to this question defines the actual perimeter of the new identity.", action: "Name it specifically. Write: I am willing to be laughed at for ___. Say it until it stops feeling like a confession." },
  { day: 27, week: 4, prompt: "What have you been holding back that the new version of you would simply do?", depth: "There's something specific. You know what it is. The old identity had a reason for holding it back. Check whether that reason still applies. Because most of the time it doesn't. It just has momentum.", action: "Name it. Do it, or take the first irreversible step toward it today." },
  { day: 28, week: 4, prompt: "Identify a belief from the old identity you're consciously choosing to keep.", depth: "Not everything in the old framework was wrong. Some of it was hard-won wisdom. The goal isn't to burn everything down. It's to choose consciously what survives the audit. Kept-by-default is different from kept-by-choice.", action: "Name the belief. Write why you're keeping it, not from habit, but because it genuinely serves who you're becoming." },
  { day: 29, week: 4, prompt: "What structure would make the new identity self-sustaining?", depth: "Identity without structure degrades under pressure. The old identity was self-sustaining because it had infrastructure: people, habits, environments that reinforced it. The new one needs the same. Except this time you're building it deliberately.", action: "Identify one habit, one environment change, and one relationship that would reinforce the new identity automatically. Implement at least one today." },
  { day: 30, week: 4, prompt: "Who are you now?", depth: "Present tense. No hedging. Not who you're trying to become — who you are. The identity is installed when you can say it without flinching. This is not a goal statement. It is a declaration.", action: "Write the statement. Not a goals list. Not an aspiration. A declaration of the operating identity you've built over 30 days. Read it out loud. Then go live from it.", isIntegration: true }
];

const STORAGE_KEY = "mind-independence-v2";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { completed: {}, reflections: {}, resistance: {}, activeDay: 1, startDate: null };
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function getStreak(completed) {
  let streak = 0;
  for (let d = 30; d >= 1; d--) {
    if (completed[d]) streak++;
    else break;
  }
  return streak;
}

function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ResistanceSelector({ value, onChange }) {
  const labels = ["", "Easy", "Mild", "Hard", "Very Hard", "Couldn't"];
  const colors = ["", "#4A9EDB", "#2ECC8E", "#C9A84C", "#E07040", "#A855A8"];
  return (
    <div>
      <div className="mono" style={{ fontSize: "0.62rem", color: "#5a4a3a", letterSpacing: "0.2em", marginBottom: "10px" }}>
        RESISTANCE TODAY
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            background: value === v ? colors[v] + "28" : "transparent",
            border: `1px solid ${value === v ? colors[v] : "#2a2520"}`,
            color: value === v ? colors[v] : "#5a4a3a",
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            transition: "all 0.15s"
          }}>
            {v} — {labels[v]}
          </button>
        ))}
      </div>
      {value && (
        <div style={{ marginTop: "8px", fontSize: "0.78rem", color: "#6a5a4a", fontStyle: "italic" }}>
          {value === 5 && "That resistance is the data. Write about why even if you can't do the action."}
          {value === 4 && "High resistance usually means the prompt is touching something real."}
          {value === 3 && "This is the productive zone, enough friction to generate insight."}
          {value === 2 && "Good. Engagement without avoidance."}
          {value === 1 && "Note that too. Which prompts feel easy might reveal where you're most defended."}
        </div>
      )}
    </div>
  );
}

function WeeklyInsight({ weekNumber, days, completedMap, reflectionsMap, resistanceMap }) {
  const weekDays = days.filter(d => d.week === weekNumber);
  const completedThisWeek = weekDays.filter(d => completedMap[d.day]).length;
  const totalWords = weekDays.reduce((sum, d) => sum + wordCount(reflectionsMap[d.day] || ""), 0);
  const avgResistance = (() => {
    const vals = weekDays.map(d => resistanceMap[d.day]).filter(Boolean);
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  })();
  const highResistDay = weekDays.reduce((max, d) => (!max || (resistanceMap[d.day] || 0) > (resistanceMap[max.day] || 0)) ? d : max, null);
  const mostWrittenDay = weekDays.reduce((max, d) => (!max || wordCount(reflectionsMap[d.day] || "") > wordCount(reflectionsMap[max.day] || "")) ? d : max, null);

  if (completedThisWeek === 0) return null;

  return (
    <div style={{ background: "#0a0908", border: "1px solid #1e1b17", padding: "20px 24px", marginTop: "24px" }}>
      <div className="mono" style={{ fontSize: "0.62rem", color: "#5a4a3a", letterSpacing: "0.2em", marginBottom: "16px" }}>
        WEEK {weekNumber} PATTERNS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div className="mono" style={{ fontSize: "0.6rem", color: "#3a3028", marginBottom: "4px" }}>DAYS COMPLETED</div>
          <div className="pf" style={{ fontSize: "1.6rem", color: "#C9A84C" }}>{completedThisWeek}<span style={{ fontSize: "0.9rem", color: "#5a4a3a" }}>/7</span></div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: "0.6rem", color: "#3a3028", marginBottom: "4px" }}>WORDS WRITTEN</div>
          <div className="pf" style={{ fontSize: "1.6rem", color: "#4A9EDB" }}>{totalWords}</div>
        </div>
        {avgResistance && <div>
          <div className="mono" style={{ fontSize: "0.6rem", color: "#3a3028", marginBottom: "4px" }}>AVG RESISTANCE</div>
          <div className="pf" style={{ fontSize: "1.6rem", color: "#E07040" }}>{avgResistance}</div>
        </div>}
      </div>
      {highResistDay && resistanceMap[highResistDay.day] >= 4 && (
        <div style={{ borderTop: "1px solid #1e1b17", paddingTop: "14px", fontSize: "0.82rem", color: "#7a6a5a", lineHeight: 1.7 }}>
          <span style={{ color: "#A855A8" }}>Highest resistance: Day {highResistDay.day}.</span> That's usually where the real work is.
          {reflectionsMap[highResistDay.day] ? " You wrote through it anyway." : " Go back to it."}
        </div>
      )}
      {mostWrittenDay && wordCount(reflectionsMap[mostWrittenDay.day] || "") > 50 && (
        <div style={{ borderTop: "1px solid #1e1b17", paddingTop: "14px", fontSize: "0.82rem", color: "#7a6a5a", lineHeight: 1.7, marginTop: highResistDay && resistanceMap[highResistDay.day] >= 4 ? "0" : "0" }}>
          <span style={{ color: "#2ECC8E" }}>Most words: Day {mostWrittenDay.day}.</span> What you write most about is usually what you need to work on most.
        </div>
      )}
    </div>
  );
}

// ─── ABOUT CONTENT ───────────────────────────────────────────────────────────

function AboutView() {
  const sections = [
    {
      title: "The Premise",
      accent: "#C9A84C",
      content: `Most people believe they are freethinkers. They can choose between options, express opinions, disagree with authority. And yet — the range of options they consider, the opinions they form, the authorities they choose to challenge — all of this operates within a pre-constructed boundary they've never examined.

This isn't a conspiracy. There's no group deciding what you're allowed to think. It's more fundamental than that: it's a requirement of civilization. Large, complex societies cannot function if every individual interprets reality independently. So what societies do, elegantly and invisibly, is create predictability.`
    },
    {
      title: "Predictability, Not Obedience",
      accent: "#A855A8",
      content: `This distinction matters. Obedience is crude: it requires force, creates resentment, generates resistance. It's expensive and unstable.

Predictability is elegant. If a system can reliably forecast how you will react to information, it doesn't need to coerce you. It can simply guide you. And the most sophisticated version of this is when people begin defending the very mechanism that shapes them, confusing the system for their own values.

The goal of this program is not to make you oppositional or paranoid. It's to make you aware of where your reactions, beliefs, and self-concept were installed rather than chosen, and then to make genuine choices about what to keep.`
    },
    {
      title: "How the Framework Gets Installed",
      accent: "#2ECC8E",
      content: `Historically, power began with violence. But violence creates martyrs and resistance. It's unsustainable. Successful societies discovered something more efficient: belief systems. Once people defend the system themselves, control becomes self-sustaining.

Religion was an early infrastructure: compressing moral complexity into clear binaries and internalizing surveillance. Education refined it further. Not as exploration, but as standardization: teaching which questions are meaningful and which are dangerous. You could ask how photosynthesis works; you couldn't persistently ask who benefits from the systems you're embedded in.

By the modern era, social pressure replaced physical punishment. Reputational damage, economic precariousness, social isolation: more effective than prisons because people fear them more.

This is not a condemnation of any of these systems. Programming is necessary. Every society programs its members. The danger arises when you confuse your program for reality itself.`
    },
    {
      title: "The Key Distinction",
      accent: "#4A9EDB",
      content: `There is a difference between being programmed and being aware that you're programmed.

We are all programmed to believe murder is wrong. That programming is good. It allows civilization. The programming itself is not the problem. The problem is when you can't see it; when you believe your moral reactions, emotional responses, and intellectual conclusions are purely your own and entirely original.

Awareness is not the end point. It's the beginning of a harder challenge: living with clarity in a world designed to prevent it. Finding your own meaning when collective meaning no longer satisfies.

The ones who succeed do so by building new structures to replace the ones they've examined. But those new structures are conscious, provisional, and individually constructed rather than collectively imposed.`
    },
    {
      title: "The 4-Week Structure",
      accent: "#C9A84C",
      content: `The 30 days are organized around a deliberate sequence. Each week builds on the last.

WEEK 1 — SEE THE BOX: Pure diagnostic. You can't change a framework you can't see. This week slows you down on purpose. The goal is honest inventory, not self-attack.

WEEK 2 — INTERROGATE: Name isn't enough. You trace beliefs to their source and measure them against actual evidence. Most limiting beliefs survive on selective memory, not data.

WEEK 3 — EXPOSE: The nervous system updates on outcomes, not intentions. This week generates contact with the reality you've been avoiding, deliberately and incrementally. Small and real beats large and imagined.

WEEK 4 — INSTALL: Identity without structure degrades under pressure. This week builds the infrastructure the new operating logic needs to survive contact with the real world.`
    },
    {
      title: "Where the Feedback Comes From",
      accent: "#2ECC8E",
      content: `The app alone doesn't provide feedback. It's a scaffold. Here's where the feedback actually lives:

Your reflections create a longitudinal record. The signal isn't in any single entry. It's in the pattern. Which days you skipped. Where your writing was vague versus specific. Which prompts you answered quickly versus sat with.

The resistance rating captures where the real friction is. High resistance usually means the prompt is touching something real. Low resistance can mean genuine progress, or it can mean you've found a comfortable way to engage without actually engaging.

Week 3 is where external feedback enters. When you act despite the fear and document what actually happened versus what you predicted, you're generating evidence that your nervous system can use. The fear calibration error becomes visible.

The integration days (7, 14, 21, 30) are for reading back across the week and finding the thing you keep circling without landing on. That's what you're actually afraid of.`
    },
    {
      title: "A Note on Solo Work",
      accent: "#E07040",
      content: `Identity work done entirely in private has one structural vulnerability: narrative capture. You can write beautifully honest reflections, feel genuine progress, and still be constructing a convincing story about your growth while the underlying avoidance patterns stay intact.

The journal can't catch that. What catches it is the Week 3 work: actual exposure to actual people in the rooms that actually matter. The internal work in Weeks 1 and 2 is preparation. The external work in Week 3 is the test. What survives that test is what you build in Week 4.

If you find yourself completing the journal days consistently but skipping or minimizing the action items, particularly in Week 3, that's the pattern worth examining.`
    }
  ];

  return (
    <div className="fade-in" style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "48px" }}>
        <div className="mono" style={{ fontSize: "0.62rem", color: "#5a4a3a", letterSpacing: "0.25em", marginBottom: "12px" }}>THE FRAMEWORK</div>
        <div className="pf" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15, color: "#F0E8DC", marginBottom: "16px" }}>
          Mental<br />Independence
        </div>
        <div style={{ fontSize: "0.95rem", color: "#7a6a5a", lineHeight: 1.8, borderLeft: "2px solid #2a2520", paddingLeft: "20px" }}>
          A 30-day program for auditing installed beliefs, examining their origins, and consciously constructing the operating logic you choose to keep.
        </div>
      </div>

      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #141210" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "24px", height: "1px", background: s.accent }} />
            <div className="mono" style={{ fontSize: "0.65rem", color: s.accent, letterSpacing: "0.2em" }}>{s.title.toUpperCase()}</div>
          </div>
          <div style={{ fontSize: "0.92rem", color: "#9a8878", lineHeight: 1.9, whiteSpace: "pre-line" }}>
            {s.content}
          </div>
        </div>
      ))}

      <div style={{ background: "#0a0908", border: "1px solid #1e1b17", padding: "24px", marginTop: "8px" }}>
        <div className="mono" style={{ fontSize: "0.62rem", color: "#5a4a3a", letterSpacing: "0.2em", marginBottom: "12px" }}>HOW TO BEGIN</div>
        <div style={{ fontSize: "0.9rem", color: "#8a7a6a", lineHeight: 1.8 }}>
          Start on Day 1. Don't skip to what looks interesting. The sequence matters. Week 1 is slow on purpose, and the temptation to jump to action before finishing the audit is itself a pattern worth examining.
          <br /><br />
          Do the action items. The reflection without the action is the comfortable version that produces the least change.
          <br /><br />
          Be honest. The journal is private. Performing honesty in writing you know is actually safe is a specific kind of evasion.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [currentView, setCurrentView] = useState("today");
  const [draftReflection, setDraftReflection] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimer = useRef(null);

  const { completed, reflections, resistance, activeDay, startDate } = data;

  useEffect(() => {
    setDraftReflection(reflections[activeDay] || "");
  }, [activeDay]);

  const update = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch };
      saveData(next);
      return next;
    });
  }, []);

  const handleReflectionChange = (val) => {
    setDraftReflection(val);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setData(prev => {
        const next = { ...prev, reflections: { ...prev.reflections, [prev.activeDay]: val } };
        saveData(next);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 1800);
        return next;
      });
    }, 800);
  };

  const toggleComplete = () => {
    const wasComplete = completed[activeDay];
    const newCompleted = { ...completed, [activeDay]: !wasComplete };
    const newStart = !startDate && !wasComplete ? new Date().toISOString() : startDate;
    update({ completed: newCompleted, startDate: newStart });
  };

  const setResistance = (val) => {
    update({ resistance: { ...resistance, [activeDay]: val } });
  };

  const setActiveDay = (day) => {
    update({ activeDay: day });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = (completedCount / 30) * 100;
  const streak = getStreak(completed);
  const currentDayData = DAYS[activeDay - 1];
  const currentWeek = WEEKS[currentDayData.week - 1];

  const NAV = [
    { id: "today", label: "TODAY" },
    { id: "calendar", label: "ALL DAYS" },
    { id: "weeks", label: "OVERVIEW" },
    { id: "about", label: "ABOUT" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080809", color: "#E8E0D4", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pf { font-family: 'Playfair Display', Georgia, serif; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        textarea { resize: none; outline: none; }
        textarea::placeholder { color: #3a3028; }
        .nav-btn { background: transparent; border: none; border-bottom: 1px solid transparent; color: #4a3a2a; cursor: pointer; padding: 10px 0; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; letter-spacing: 0.18em; transition: all 0.2s; }
        .nav-btn:hover { color: #8a7a5a; }
        .nav-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .day-row { display: flex; align-items: center; gap: 16px; padding: 11px 16px; cursor: pointer; transition: background 0.12s; }
        .day-row:hover { background: rgba(255,255,255,0.025); }
        .arrow-btn { background: transparent; border: 1px solid #1e1b17; color: #5a4a3a; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 1rem; }
        .arrow-btn:hover:not(:disabled) { border-color: #C9A84C; color: #C9A84C; }
        .arrow-btn:disabled { opacity: 0.2; cursor: default; }
        .action-btn { border: none; cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; letter-spacing: 0.18em; padding: 14px 28px; transition: all 0.2s; width: 100%; }
        .pulse { animation: pulse 2.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2520; }
        .week-card { border: 1px solid #1a1715; padding: 20px 24px; cursor: pointer; transition: all 0.15s; }
        .week-card:hover { background: rgba(255,255,255,0.018); border-color: #2a2520; }
        .outline-btn { background: transparent; border: 1px solid #2a2520; color: #6a5a4a; cursor: pointer; padding: 7px 16px; font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.15em; transition: all 0.2s; }
        .outline-btn:hover { border-color: #C9A84C; color: #C9A84C; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #141210", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <div className="pf" style={{ fontSize: "1.05rem", color: "#E8E0D4", letterSpacing: "0.04em" }}>Mental Independence</div>
          <div className="mono" style={{ fontSize: "0.58rem", color: "#3a2e28", letterSpacing: "0.2em" }}>30-DAY PROGRAM</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {streak > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C9A84C" }} className="pulse" />
              <div className="mono" style={{ fontSize: "0.6rem", color: "#C9A84C", letterSpacing: "0.15em" }}>{streak} DAY STREAK</div>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: "0.58rem", color: "#3a2e28", letterSpacing: "0.18em", marginBottom: "5px" }}>{completedCount}/30</div>
            <div style={{ width: "100px", height: "1px", background: "#1a1715", position: "relative" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#C9A84C", transition: "width 0.6s ease" }} />
            </div>
          </div>
          {saveStatus && <div className="mono" style={{ fontSize: "0.58rem", color: "#2ECC8E", letterSpacing: "0.15em" }}>✓ SAVED</div>}
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: "1px solid #141210", padding: "0 32px", display: "flex", gap: "28px" }}>
        {NAV.map(n => (
          <button key={n.id} className={`nav-btn ${currentView === n.id ? "active" : ""}`} onClick={() => setCurrentView(n.id)}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "36px 32px" }}>

        {/* ── TODAY ── */}
        {currentView === "today" && (
          <div className="fade-in">
            {/* Week badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: currentWeek.accent }} className="pulse" />
              <span className="mono" style={{ fontSize: "0.62rem", color: currentWeek.accent, letterSpacing: "0.2em" }}>
                WEEK {currentWeek.number} — {currentWeek.title}
              </span>
              {currentDayData.isIntegration && (
                <span className="mono" style={{ fontSize: "0.58rem", color: "#4a3a2a", letterSpacing: "0.15em", marginLeft: "8px" }}>
                  INTEGRATION DAY
                </span>
              )}
            </div>

            {/* Day header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
              <div style={{ flex: 1, marginRight: "20px" }}>
                <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", letterSpacing: "0.25em", marginBottom: "10px" }}>DAY {activeDay} OF 30</div>
                <div className="pf" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", lineHeight: 1.25, color: "#F0E8DC" }}>
                  {currentDayData.prompt}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginTop: "4px" }}>
                <button className="arrow-btn" onClick={() => setActiveDay(activeDay - 1)} disabled={activeDay <= 1}>←</button>
                <button className="arrow-btn" onClick={() => setActiveDay(activeDay + 1)} disabled={activeDay >= 30}>→</button>
              </div>
            </div>

            {/* Week context */}
            <div style={{ borderLeft: `2px solid ${currentWeek.accent}40`, paddingLeft: "20px", marginBottom: "28px" }}>
              <div style={{ fontSize: "0.82rem", color: "#6a5a4a", lineHeight: 1.75, fontStyle: "italic" }}>
                {currentWeek.logic}
              </div>
            </div>

            {/* Depth */}
            <div style={{ marginBottom: "28px" }}>
              <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", letterSpacing: "0.2em", marginBottom: "12px" }}>GO DEEPER</div>
              <div style={{ fontSize: "0.92rem", color: "#8a7870", lineHeight: 1.85 }}>{currentDayData.depth}</div>
            </div>

            {/* Action */}
            <div style={{ background: "#0c0b09", border: `1px solid ${currentWeek.accent}22`, padding: "20px 24px", marginBottom: "28px" }}>
              <div className="mono" style={{ fontSize: "0.6rem", color: currentWeek.accent, letterSpacing: "0.2em", marginBottom: "10px" }}>TODAY'S ACTION</div>
              <div style={{ fontSize: "0.88rem", color: "#b8a888", lineHeight: 1.8 }}>{currentDayData.action}</div>
            </div>

            {/* Resistance */}
            <div style={{ marginBottom: "24px" }}>
              <ResistanceSelector value={resistance[activeDay]} onChange={setResistance} />
            </div>

            {/* Reflection */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", letterSpacing: "0.2em" }}>YOUR REFLECTION</div>
                {draftReflection && (
                  <div className="mono" style={{ fontSize: "0.58rem", color: "#3a2e28" }}>
                    {wordCount(draftReflection)} words
                  </div>
                )}
              </div>
              <textarea
                value={draftReflection}
                onChange={e => handleReflectionChange(e.target.value)}
                placeholder="Write here. Private. Honest or it's pointless."
                style={{
                  width: "100%", minHeight: "160px",
                  background: "#080809", border: "1px solid #1a1715",
                  color: "#c0a888", fontSize: "0.9rem", lineHeight: 1.85,
                  padding: "16px 18px", fontFamily: "Georgia, serif"
                }}
              />
            </div>

            {/* Complete */}
            <button className="action-btn" onClick={toggleComplete} style={{
              background: completed[activeDay] ? "#C9A84C" : "transparent",
              color: completed[activeDay] ? "#080809" : "#C9A84C",
              border: `1px solid ${completed[activeDay] ? "#C9A84C" : "#C9A84C45"}`
            }}>
              {completed[activeDay] ? "✓ DAY COMPLETE — CLICK TO UNDO" : "MARK DAY COMPLETE"}
            </button>

            {/* Weekly insight if integration day and week complete enough */}
            {currentDayData.isIntegration && (
              <WeeklyInsight
                weekNumber={currentDayData.week}
                days={DAYS}
                completedMap={completed}
                reflectionsMap={reflections}
                resistanceMap={resistance}
              />
            )}
          </div>
        )}

        {/* ── CALENDAR ── */}
        {currentView === "calendar" && (
          <div className="fade-in">
            <div className="pf" style={{ fontSize: "1.6rem", marginBottom: "32px", color: "#F0E8DC" }}>All 30 Days</div>
            {WEEKS.map(week => {
              const weekDays = DAYS.filter(d => d.week === week.number);
              return (
                <div key={week.number} style={{ marginBottom: "36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ height: "1px", width: "16px", background: week.accent }} />
                    <div className="mono" style={{ fontSize: "0.62rem", color: week.accent, letterSpacing: "0.2em" }}>
                      WEEK {week.number} — {week.title}
                    </div>
                  </div>
                  {weekDays.map(d => {
                    const wc = wordCount(reflections[d.day] || "");
                    return (
                      <div key={d.day} className="day-row"
                        onClick={() => { setActiveDay(d.day); setCurrentView("today"); }}
                        style={{
                          borderLeft: `2px solid ${completed[d.day] ? week.accent : activeDay === d.day ? week.accent + "50" : "#1a1715"}`,
                          background: activeDay === d.day ? `${week.accent}0a` : "transparent"
                        }}>
                        <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", width: "50px" }}>DAY {d.day}</div>
                        <div style={{ fontSize: "0.84rem", color: completed[d.day] ? "#7a6a4a" : "#b0a080", flex: 1, lineHeight: 1.4 }}>{d.prompt}</div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                          {resistance[d.day] && (
                            <div className="mono" style={{ fontSize: "0.58rem", color: ["", "#4A9EDB", "#2ECC8E", "#C9A84C", "#E07040", "#A855A8"][resistance[d.day]] }}>
                              R{resistance[d.day]}
                            </div>
                          )}
                          {wc > 0 && <div className="mono" style={{ fontSize: "0.58rem", color: "#3a2e28" }}>{wc}w</div>}
                          {completed[d.day] && <div style={{ color: week.accent, fontSize: "0.75rem" }}>✓</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── WEEKS / OVERVIEW ── */}
        {currentView === "weeks" && (
          <div className="fade-in">
            <div className="pf" style={{ fontSize: "1.6rem", marginBottom: "32px", color: "#F0E8DC" }}>The Framework</div>

            {WEEKS.map(week => {
              const weekDays = DAYS.filter(d => d.week === week.number);
              const doneCount = weekDays.filter(d => completed[d.day]).length;
              const totalWords = weekDays.reduce((s, d) => s + wordCount(reflections[d.day] || ""), 0);
              return (
                <div key={week.number} className="week-card" style={{ marginBottom: "10px" }}
                  onClick={() => { setActiveDay(weekDays[0].day); setCurrentView("today"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div className="mono" style={{ fontSize: "0.6rem", color: week.accent, letterSpacing: "0.2em", marginBottom: "6px" }}>WEEK {week.number}</div>
                      <div className="pf" style={{ fontSize: "1.25rem", color: "#F0E8DC" }}>{week.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#5a4a3a", fontStyle: "italic", marginTop: "3px" }}>{week.subtitle}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: "0.75rem", color: doneCount === 7 ? week.accent : "#3a2e28" }}>{doneCount}/7</div>
                      {totalWords > 0 && <div className="mono" style={{ fontSize: "0.58rem", color: "#3a2e28", marginTop: "4px" }}>{totalWords}w</div>}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "#7a6a5a", lineHeight: 1.75, marginBottom: "14px" }}>{week.description}</div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {weekDays.map(d => (
                      <div key={d.day} style={{ flex: 1, height: "3px", background: completed[d.day] ? week.accent : "#1a1715", transition: "background 0.3s" }} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Stats panel */}
            <div style={{ marginTop: "28px", padding: "24px", border: "1px solid #141210", background: "#0a0908" }}>
              <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", letterSpacing: "0.2em", marginBottom: "20px" }}>YOUR DATA</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {[
                  ["DAYS DONE", completedCount, "#C9A84C"],
                  ["STREAK", streak, "#2ECC8E"],
                  ["WORDS", Object.values(reflections).reduce((s, r) => s + wordCount(r || ""), 0), "#4A9EDB"],
                  ["REMAINING", 30 - completedCount, "#2a2520"]
                ].map(([label, val, color]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div className="pf" style={{ fontSize: "2rem", color, lineHeight: 1 }}>{val}</div>
                    <div className="mono" style={{ fontSize: "0.55rem", color: "#3a2e28", letterSpacing: "0.18em", marginTop: "6px" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Resistance pattern */}
              {Object.keys(resistance).length > 0 && (
                <div style={{ marginTop: "24px", borderTop: "1px solid #141210", paddingTop: "20px" }}>
                  <div className="mono" style={{ fontSize: "0.6rem", color: "#3a2e28", letterSpacing: "0.2em", marginBottom: "12px" }}>RESISTANCE BY DAY</div>
                  <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "36px" }}>
                    {DAYS.map(d => {
                      const r = resistance[d.day] || 0;
                      const colors = ["#1a1715", "#4A9EDB", "#2ECC8E", "#C9A84C", "#E07040", "#A855A8"];
                      return (
                        <div key={d.day} title={`Day ${d.day}: ${r ? "R" + r : "no data"}`} style={{
                          flex: 1, height: `${r ? (r / 5) * 100 : 8}%`,
                          background: colors[r], transition: "height 0.3s", cursor: "pointer",
                          opacity: r ? 1 : 0.3, minHeight: "3px"
                        }} onClick={() => { setActiveDay(d.day); setCurrentView("today"); }} />
                      );
                    })}
                  </div>
                  <div className="mono" style={{ fontSize: "0.55rem", color: "#2a2018", marginTop: "8px" }}>
                    HIGH RESISTANCE DAYS ARE USUALLY WHERE THE REAL WORK IS
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        {currentView === "about" && <AboutView />}
      </div>
    </div>
  );
}
