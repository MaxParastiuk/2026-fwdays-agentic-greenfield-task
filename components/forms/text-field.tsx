import type { InputHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  className?: string;
}

export function TextField({
  label,
  hint,
  error,
  icon,
  id,
  className = "",
  ...rest
}: TextFieldProps) {
  const fieldId =
    id ?? (label ? `f-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={`ds-field ${className}`.trim()}>
      {label ? (
        <label className="ds-field__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <div className="ds-field__wrap">
        {icon ? (
          <span className="ds-field__icon" aria-hidden>
            <Icon name={icon} size={16} />
          </span>
        ) : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={`ds-input focus-ring ${icon ? "ds-input--icon" : ""} ${error ? "ds-input--error" : ""}`.trim()}
          {...rest}
        />
      </div>
      {error ? (
        <span className="ds-field__error">
          <Icon name="alert-triangle" size={12} />
          {error}
        </span>
      ) : hint ? (
        <span className="ds-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
