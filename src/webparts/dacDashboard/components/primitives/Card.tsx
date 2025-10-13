import * as React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const baseCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
  padding: 16,
  gap: 12
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: '#0f172a'
};

const footerStyle: React.CSSProperties = {
  marginTop: 8,
  paddingTop: 8,
  borderTop: '1px solid rgba(15, 23, 42, 0.08)',
  fontSize: 13,
  color: '#475569'
};

const mergeStyles = (base: React.CSSProperties, override?: React.CSSProperties): React.CSSProperties => ({
  ...base,
  ...(override || {})
});

const joinClassNames = (a?: string, b?: string): string | undefined => {
  if (a && b) {
    return `${a} ${b}`;
  }
  return a || b || undefined;
};

export const Card: React.FC<CardProps> = ({ title, headerActions, footer, children, style, className }) => (
  <section style={mergeStyles(baseCardStyle, style)} className={joinClassNames('dac-card', className)}>
    {(title || headerActions) && (
      <header style={headerStyle}>
        {title ? <h3 style={titleStyle}>{title}</h3> : <span />}
        {headerActions}
      </header>
    )}
    <div>{children}</div>
    {footer ? <footer style={footerStyle}>{footer}</footer> : null}
  </section>
);

export default Card;
