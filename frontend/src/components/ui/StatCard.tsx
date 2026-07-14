import './StatCard.css';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'red' | 'amber';
  trend?: string;
}

export default function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <motion.div
      className={`stat-card stat-card--${color}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>
    </motion.div>
  );
}
