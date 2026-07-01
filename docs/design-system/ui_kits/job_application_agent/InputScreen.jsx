// InputScreen — the two-panel landing: CV on the left, job posting on the
// right, run button beneath. Nothing runs until both inputs validate.
const NSi = window.JobApplicationAgentDesignSystem_8adca7;

const SAMPLE_CV = `JANE DOE
Staff Software Engineer · Berlin · jane@example.com

SUMMARY
Reliability-focused engineer with 9 years building distributed systems.
Cut p99 latency 38% across the payments platform and mentored six
engineers to senior. Comfortable owning a service end to end, from
on-call rotation to capacity planning.

EXPERIENCE
Acme Payments — Staff Engineer (2021–present)
- Reduced p99 checkout latency from 940ms to 580ms.
- Brought on-call pages down from 19/week to 3/week.`;

function InputScreen({ onRun }) {
  const { SegmentedControl, UploadZone, TextArea, TextField, CollapsiblePreview, Button, Card } = NSi;

  const [cvMode, setCvMode] = React.useState('upload');
  const [cvFile, setCvFile] = React.useState({ name: 'jane-doe-cv.pdf', size: '142 KB' });
  const [cvText, setCvText] = React.useState('');

  const [jobMode, setJobMode] = React.useState('url');
  const [jobUrl, setJobUrl] = React.useState('https://careers.acme.com/staff-engineer');
  const [jobText, setJobText] = React.useState('');

  const cvReady = cvMode === 'upload' ? !!cvFile : cvText.trim().length > 60;
  const validUrl = /^https?:\/\/.+\..+/.test(jobUrl.trim());
  const jobReady = jobMode === 'url' ? validUrl : jobText.trim().length > 60;
  const runEnabled = cvReady && jobReady;

  const panelLabel = {
    fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
    letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint)',
    marginBottom: 4,
  };
  const panelTitle = {
    fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--text-strong)',
  };
  const panelHead = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 };

  return (
    <div>
      <div style={{ maxWidth: 640, marginBottom: 30 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.08, color: 'var(--ink-900)' }}>
          A cover letter worth signing.
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.55, color: 'var(--text-body)', marginTop: 12, marginBottom: 0 }}>
          Provide your CV and the job posting. A Maker writes the letter, a Checker scores it against both,
          and the loop repeats up to three times — until the words fit the role.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* CV panel */}
        <Card elevation="raised" padding="lg">
          <div style={panelHead}>
            <div>
              <div style={panelLabel}>Step 1</div>
              <div style={panelTitle}>Your CV</div>
            </div>
            <SegmentedControl value={cvMode} onChange={setCvMode}
              options={[{ value: 'upload', label: 'Upload PDF', icon: 'upload' }, { value: 'paste', label: 'Paste text', icon: 'file-text' }]} />
          </div>
          {cvMode === 'upload' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <UploadZone file={cvFile}
                onSelect={(f) => setCvFile({ name: f.name, size: Math.max(1, Math.round(f.size / 1024)) + ' KB' })}
                onRemove={() => setCvFile(null)} />
              {cvFile && <CollapsiblePreview title="Extracted text" confirmedLabel="Parsed" text={SAMPLE_CV} />}
            </div>
          ) : (
            <TextArea label="Paste plain-text CV" count value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV as plain text…" style={{ minHeight: 188 }} />
          )}
        </Card>

        {/* Job panel */}
        <Card elevation="raised" padding="lg">
          <div style={panelHead}>
            <div>
              <div style={panelLabel}>Step 2</div>
              <div style={panelTitle}>Job posting</div>
            </div>
            <SegmentedControl value={jobMode} onChange={setJobMode}
              options={[{ value: 'url', label: 'Job URL', icon: 'link' }, { value: 'paste', label: 'Paste text', icon: 'file-text' }]} />
          </div>
          {jobMode === 'url' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TextField label="Posting URL" icon="link" value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                error={jobUrl && !validUrl ? 'Enter a full URL, or paste the text instead.' : undefined}
                hint="We scrape the visible body text server-side." />
              {validUrl && <CollapsiblePreview title="Scraped text" confirmedLabel="Scraped"
                text={'Staff Software Engineer — Acme\nWe are looking for a staff engineer to steady a fast-growing payments platform. You will own reliability end to end: on-call, capacity planning, and latency. Experience with distributed tracing is a strong plus.'} />}
            </div>
          ) : (
            <TextArea label="Paste the job posting" count value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the posting text…" style={{ minHeight: 188 }} />
          )}
        </Card>
      </div>

      {/* Run row */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 30 }}>
        <Button variant="primary" size="lg" icon="pen-line" disabled={!runEnabled} onClick={onRun}>
          Generate cover letter
        </Button>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-faint)' }}>
          {runEnabled ? 'Runs up to three iterations · target score 8.0 / 10' : 'Provide a CV and a job posting to begin.'}
        </div>
      </div>
    </div>
  );
}

window.InputScreen = InputScreen;
