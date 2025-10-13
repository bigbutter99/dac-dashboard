import * as React from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const tonePalette: Record<BadgeTone, { bg: string; color: string; border: string }> = {
  neutral: { bg: '#f1f5f9', color: '#0f172a', border: 'rgba(148, 163, 184, 0.6)' },
  success: { bg: '#dcfce7', color: '#166534', border: 'rgba(34, 197, 94, 0.6)' },
  warning: { bg: '#fef9c3', color: '#854d0e', border: 'rgba(217, 119, 6, 0.6)' },
  danger: { bg: '#fee2e2', color: '#b91c1c', border: 'rgba(248, 113, 113, 0.6)' },
  info: { bg: '#dbeafe', color: '#1d4ed8', border: 'rgba(96, 165, 250, 0.6)' }
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.6
};

const joinClassNames = (a?: string, b?: string): string | undefined => {
  if (a && b) {
    return `${a} ${b}`;
  }
  return a || b || undefined;
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children, className }) => {
  const palette = tonePalette[tone];
  const style = {
    ...baseStyle,
    backgroundColor: palette.bg,
    color: palette.color,
    border: `1px solid ${palette.border}`
  };

  return (
    <span style={style} className={joinClassNames('dac-badge', className)}>
      {children}
    </span>
  );
};

export default Badge;
