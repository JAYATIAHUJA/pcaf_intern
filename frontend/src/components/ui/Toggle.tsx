import React from 'react';

interface ToggleProps {
  /** The current checked state of the toggle. */
  checked: boolean;
  /** Called when the user clicks or presses Space/Enter to toggle. */
  onChange?: () => void;
  /** Accessible label describing what this toggle controls (for screen readers). */
  label?: string;
  /** Optional id — useful when pairing with an external <label> element. */
  id?: string;
}

/**
 * Accessible toggle switch component.
 *
 * Meets WCAG 2.1 SC 4.1.2 by:
 *  - Using role="switch" so assistive technology announces it as a switch control.
 *  - Exposing aria-checked to reflect the current state.
 *  - Responding to keyboard activation (Space and Enter).
 *  - Supporting aria-label / id for screen reader labelling.
 */
export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.();
    }
  };

  return (
    <div
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        width: 40,
        height: 20,
        borderRadius: '999px',
        cursor: 'pointer',
        background: checked ? '#0ea5e9' : '#e2e8f0',
        transition: 'background 0.15s ease',
        outline: 'none',
        flexShrink: 0,
      }}
      // Show a visible focus ring when navigating by keyboard
      onFocus={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(14,165,233,0.35)'; }}
      onBlur={e =>  { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.15s ease',
          left: checked ? 22 : 2,
        }}
      />
    </div>
  );
}
