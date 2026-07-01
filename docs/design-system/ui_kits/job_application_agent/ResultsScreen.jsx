// ResultsScreen — final letter, final-iteration gap analysis, and the
// iteration score history. Composes LetterPanel, GapList, IterationTimeline.
const NSre = window.JobApplicationAgentDesignSystem_8adca7;

const FINAL_LETTER = `Dear hiring team,

Your staff engineer posting calls for someone who can steady a fast-growing payments platform without slowing it down. Over the last four years I have done exactly that. I cut p99 checkout latency from 940ms to 580ms, and brought our on-call load from nineteen pages a week to three.

Reliability, for me, is not a separate workstream — it is how I build. I have owned capacity planning, led incident reviews, and introduced distributed tracing across a twelve-service estate, which is where I see the clearest overlap with your team's current focus.

I would welcome the chance to bring that same steadiness to your platform.

Regards,
Jane Doe`;

const ITERATIONS = [
  { iteration: 1, score: 6.4, rationale: 'Solid writing, but does not address the role focus on reliability or quantify impact.', gaps: ['No mention of on-call or incident experience', 'No quantified impact', 'Closing paragraph is generic'] },
  { iteration: 2, score: 7.8, rationale: 'Much closer. Reliability is addressed; one metric would push it over the bar.', gaps: ['Distributed tracing (a posting priority) not mentioned'] },
  { iteration: 3, score: 8.6, rationale: 'Targeted and specific. Addresses every posting priority with concrete evidence.', gaps: [] },
];

function ResultsScreen({ onReset }) {
  const { LetterPanel, IterationTimeline, GapList, Card, Button, Icon } = NSre;
  const sectionLabel = {
    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
    letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 12,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 28, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <LetterPanel letter={FINAL_LETTER} finalScore={8.6} iterations={3} model="google/gemini-2.0-flash" />

        <Card elevation="flat" padding="lg">
          <div style={sectionLabel}>Gap analysis · final iteration</div>
          <GapList gaps={[]} emptyLabel="No gaps remaining — the letter met the bar." />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-muted)', marginTop: 12, marginBottom: 0 }}>
            Earlier rounds surfaced on-call experience, quantified impact, and distributed tracing —
            each was addressed before the run completed. Review the history to see how.
          </p>
        </Card>

        <div>
          <Button variant="ghost" icon="refresh-cw" onClick={onReset}>Start over with a new CV</Button>
        </div>
      </div>

      <Card elevation="raised" padding="lg">
        <div style={sectionLabel}>How the letter evolved</div>
        <IterationTimeline iterations={ITERATIONS} />
      </Card>
    </div>
  );
}

window.ResultsScreen = ResultsScreen;
