import './ChartCard.css';
import Card from './Card';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ChartCard({ title, action, children }: ChartCardProps) {
  return (
    <Card padding="md" className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
        {action && <div className="chart-card__action">{action}</div>}
      </div>
      <div className="chart-card__body">{children}</div>
    </Card>
  );
}
