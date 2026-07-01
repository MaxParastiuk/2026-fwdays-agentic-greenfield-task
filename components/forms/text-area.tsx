import type { TextareaHTMLAttributes } from "react";

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  label?: string;
  hint?: string;
  count?: boolean;
  mono?: boolean;
  error?: string;
  className?: string;
}

export function TextArea({
  label,
  hint,
  count,
  value,
  mono = false,
  error,
  id,
  className = "",
  ...rest
}: TextAreaProps) {
  const fieldId =
    id ?? (label ? `ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const length = typeof value === "string" ? value.length : null;

  return (
    <div className={`ds-ta ${className}`.trim()}>
      {label ? (
        <label className="ds-ta__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        value={value}
        aria-invalid={error ? true : undefined}
        className={`ds-ta__field ${mono ? "ds-ta__field--mono" : ""} ${error ? "ds-ta__field--error" : ""}`.trim()}
        {...rest}
      />
      {hint || count || error ? (
        <div className="ds-ta__foot">
          <span className={error ? "ds-ta__error" : undefined}>
            {error ?? hint}
          </span>
          {count && length != null ? (
            <span>{length.toLocaleString()} characters</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
