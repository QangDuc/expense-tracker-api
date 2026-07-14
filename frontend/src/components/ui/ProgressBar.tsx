import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const color = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'success';

  return (
    <div className={`progress progress--${size}`}>
      {(label || showPercent) && (
        <div className="progress__info">
          {label && <span className="progress__label">{label}</span>}
          {showPercent && <span className="progress__percent">{pct}%</span>}
        </div>
      )}
      <div className="progress__track">
        <div
          className={`progress__fill progress__fill--${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
