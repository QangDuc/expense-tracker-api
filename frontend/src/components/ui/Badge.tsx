import './Badge.css';

interface BadgeProps {
  variant?: 'income' | 'expense' | 'info' | 'warning' | 'default';
  children: React.ReactNode;
}

export default function Badge({ variant = 'default', children }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
