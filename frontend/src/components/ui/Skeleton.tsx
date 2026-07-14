import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

export default function Skeleton({ width, height = '16px', radius, className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton width="48px" height="48px" radius="12px" />
      <div className="skeleton-card__lines">
        <Skeleton width="60%" height="12px" />
        <Skeleton width="80%" height="20px" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <Skeleton width="30%" height="14px" />
      <Skeleton width="20%" height="14px" />
      <Skeleton width="15%" height="14px" />
      <Skeleton width="10%" height="14px" />
    </div>
  );
}
