import React from 'react';
import { inject } from '../core/inject.js';
import { Icon } from '../core/Icon.jsx';

inject('uploadzone', `
.ds-drop {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; text-align: center; cursor: pointer;
  border: 1.5px dashed var(--line-strong); border-radius: var(--radius-lg);
  background: var(--paper-deep); padding: 30px 24px; min-height: 150px;
  transition: border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
}
.ds-drop:hover { border-color: var(--accent-300); }
.ds-drop--over { border-color: var(--accent-500); border-style: solid; background: var(--accent-050); }
.ds-drop--error { border-color: var(--fail); background: var(--fail-bg); }
.ds-drop__ic { color: var(--accent-500); }
.ds-drop--error .ds-drop__ic { color: var(--fail); }
.ds-drop__title { font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--text-strong); }
.ds-drop__title b { color: var(--accent-500); }
.ds-drop__hint { font-family: var(--font-sans); font-size: 12px; color: var(--text-faint); }
.ds-drop--error .ds-drop__hint { color: var(--fail); }

.ds-file {
  display: flex; align-items: center; gap: 12px;
  border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  background: var(--surface); padding: 14px 16px;
}
.ds-file__ic { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; flex: none; border-radius: var(--radius-sm); background: var(--accent-100); color: var(--accent-700); }
.ds-file__name { font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--text-strong); }
.ds-file__meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); margin-top: 2px; }
.ds-file__x { margin-left: auto; }
`);

/**
 * UploadZone — drag-and-drop / click target for a CV PDF.
 * Stateless presentation: pass `file` to show the selected-file row,
 * or `error` for the rejected state. Wire `onSelect(file)` and `onRemove`.
 */
export function UploadZone({
  file, error, accept = '.pdf', maxLabel = '5 MB', onSelect, onRemove, className = '', style = {},
}) {
  const inputRef = React.useRef(null);
  const [over, setOver] = React.useState(false);

  if (file) {
    return (
      <div className={`ds-file ${className}`} style={style}>
        <span className="ds-file__ic"><Icon name="file-text" size={20} /></span>
        <div>
          <div className="ds-file__name">{file.name}</div>
          <div className="ds-file__meta">{file.size} · parsed server-side</div>
        </div>
        <button type="button" className="ds-file__x"
          aria-label="Remove file"
          onClick={onRemove}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex' }}>
          <Icon name="x" size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`ds-drop ${over ? 'ds-drop--over' : ''} ${error ? 'ds-drop--error' : ''} ${className}`}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f && onSelect) onSelect(f); }}
    >
      <input ref={inputRef} type="file" accept={accept} hidden
        onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f && onSelect) onSelect(f); }} />
      <span className="ds-drop__ic"><Icon name={error ? 'alert-triangle' : 'upload'} size={26} strokeWidth={1.75} /></span>
      {error
        ? <><div className="ds-drop__title">{error}</div><div className="ds-drop__hint">Try a different file, or switch to pasted text.</div></>
        : <><div className="ds-drop__title">Drop your CV here, or <b>browse</b></div><div className="ds-drop__hint">PDF up to {maxLabel} · processed in memory, never stored</div></>}
    </div>
  );
}
