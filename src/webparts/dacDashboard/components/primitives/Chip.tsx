import * as React from 'react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 999,
  border: '1px solid rgba(15, 23, 42, 0.16)',
  background: '#f8fafc',
  color: '#0f172a',
  fontSize: 13,
  cursor: 'pointer',
  transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  userSelect: 'none'
};

const activeStyle: React.CSSProperties = {
  background: '#1e293b',
  color: '#f8fafc',
  borderColor: 'rgba(15, 23, 42, 0.9)'
};

const joinClassNames = (a?: string, b?: string): string | undefined => {
  if (a && b) {
    return `${a} ${b}`;
  }
  return a || b || undefined;
};

export const Chip: React.FC<ChipProps> = ({ label, selected = false, icon, onClick, onRemove, className }) => {
  const handleChipClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    },
    [onClick]
  );

  const handleRemoveClick = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      event.preventDefault();
      if (onRemove) {
        onRemove();
      }
    },
    [onRemove]
  );

  const style = selected ? { ...chipStyle, ...activeStyle } : chipStyle;

  return (
    <button type="button" style={style} className={joinClassNames('dac-chip', className)} onClick={handleChipClick}>
      {icon}
      <span>{label}</span>
      {onRemove ? (
        <span
          role="button"
          tabIndex={0}
          onClick={handleRemoveClick}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleRemoveClick(event as unknown as React.MouseEvent<HTMLSpanElement>);
            }
          }}
          style={{
            marginLeft: 4,
            fontSize: 14,
            lineHeight: 1,
            cursor: 'pointer',
            color: selected ? '#f1f5f9' : '#475569'
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </span>
      ) : null}
    </button>
  );
};

export default Chip;
