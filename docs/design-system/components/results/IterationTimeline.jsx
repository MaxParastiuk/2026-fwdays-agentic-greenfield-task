import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';
import { ScoreBadge } from './ScoreBadge.jsx';
import { GapList } from './GapList.jsx';

inject('timeline', `
.ds-tl { display: flex; flex-direction: column; }
.ds-tl__row { position: relative; display: flex; gap: 14px; padding-bottom: 6px; }
.ds-tl__rail { display: flex; flex-direction: column; align-items: center; flex: none; width: 28px; }
.ds-tl__node {
  width: 28px; height: 28px; border-radius: 50%; flex: none;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  background: var(--surface); color: var(--text-muted); border: 1.5px solid var(--border-strong);
}
.ds-tl__node--last { background: var(--accent-700); color: #FBFAF7; border-color: var(--accent-700); }
.ds-tl__line { flex: 1; width: 1.5px; background: var(--border-default); margin: 4px 0; min-height: 8px; }
.ds-tl__body { flex: 1; min-width: 0; padding-bottom: 18px; }
.ds-tl__head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ds-tl__title { font-family: var(--font-sans); font-size: 13.5px; font-weight: 700; color: var(--text-strong); }
.ds-tl__final { font-family: var(--font-sans); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent-500); }
.ds-tl__rationale { font-family: var(--font-serif); font-style: italic; font-size: 14px; line-height: 1.5; color: var(--text-muted); margin: 8px 0 10px; }
.ds-tl__toggle {
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  background: transparent; border: none; padding: 0;
  font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: var(--accent-500);
}
.ds-tl__chev { transition: transform var(--dur-base) var(--ease-out); }
.ds-tl__chev--open { transform: rotate(90deg); }
.ds-tl__gaps { margin-top: 10px; padding-left: 2px; }
`);

/**
 * IterationTimeline — per-round score history (FR-RESULTS-03). Each entry
 * shows the round number, its ScoreBadge, the Checker rationale, and a
 * collapsible GapList. The final (best) round is emphasised.
 */
export function IterationTimeline({ iterations = [], defaultOpenLast = true, className = '', style = {} }) {
  const [open, setOpen] = React.useState(() => {
    const init = {};
    iterations.forEach((_, i) => { init[i] = defaultOpenLast && i === iterations.length - 1; });
    return init;
  });
  const toggle = (i) => setOpen(o => ({ ...o, [i]: !o[i] }));

  return (
    <div className={`ds-tl ${className}`} style={style}>
      {iterations.map((it, i) => {
        const isLast = i === iterations.length - 1;
        const gaps = it.gaps || [];
        return (
          <div key={i} className="ds-tl__row">
            <div className="ds-tl__rail">
              <div className={`ds-tl__node ${isLast ? 'ds-tl__node--last' : ''}`}>{it.iteration ?? i + 1}</div>
              {!isLast && <div className="ds-tl__line" />}
            </div>
            <div className="ds-tl__body">
              <div className="ds-tl__head">
                <span className="ds-tl__title">Iteration {it.iteration ?? i + 1}</span>
                <ScoreBadge score={it.score} size="sm" />
                {isLast && <span className="ds-tl__final">Final letter</span>}
              </div>
              {it.rationale && <div className="ds-tl__rationale">“{it.rationale}”</div>}
              {gaps.length > 0 ? (
                <>
                  <button type="button" className="ds-tl__toggle" aria-expanded={!!open[i]} onClick={() => toggle(i)}>
                    <Icon name="chevron-right" size={14} className={`ds-tl__chev ${open[i] ? 'ds-tl__chev--open' : ''}`} />
                    {gaps.length} {gaps.length === 1 ? 'gap' : 'gaps'} identified
                  </button>
                  {open[i] && <div className="ds-tl__gaps"><GapList gaps={gaps} /></div>}
                </>
              ) : (
                <div className="ds-tl__gaps"><GapList gaps={[]} /></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
