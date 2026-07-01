// RunningView — the live Maker→Checker run. Advances a ProgressStream
// through writing/checking phases, then calls onComplete.
const NSr = window.JobApplicationAgentDesignSystem_8adca7;

const RUN_STEPS = [
  { label: 'Iteration 1 · writing' },
  { label: 'Iteration 1 · checking', phase: 'score 6.4' },
  { label: 'Iteration 2 · writing' },
  { label: 'Iteration 2 · checking', phase: 'score 7.8' },
  { label: 'Iteration 3 · writing' },
  { label: 'Iteration 3 · checking', phase: 'score 8.6' },
];

function RunningView({ onComplete, onProgress }) {
  const { ProgressStream, Card, Icon } = NSr;
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (idx >= RUN_STEPS.length) { const t = setTimeout(onComplete, 650); return () => clearTimeout(t); }
    const t = setTimeout(() => { setIdx(i => i + 1); if (onProgress) onProgress(idx + 1); }, 850);
    return () => clearTimeout(t);
  }, [idx]);

  const steps = RUN_STEPS.map((s, i) => ({
    ...s,
    status: i < idx ? 'done' : i === idx ? 'active' : 'pending',
    phase: i <= idx ? s.phase : undefined,
  }));
  const iterationOf = Math.min(3, Math.floor(idx / 2) + 1);

  return (
    <div style={{ maxWidth: 560, margin: '8px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--ink-900)' }}>
          Writing your letter.
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
          Iteration {iterationOf} of 3 · revising against every gap the Checker names.
        </p>
      </div>
      <Card elevation="raised" padding="lg">
        <ProgressStream steps={steps} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-soft)',
          fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-faint)' }}>
          <Icon name="refresh-cw" size={13} />
          google/gemini-2.0-flash · target 8.0 / 10
        </div>
      </Card>
    </div>
  );
}

window.RunningView = RunningView;
