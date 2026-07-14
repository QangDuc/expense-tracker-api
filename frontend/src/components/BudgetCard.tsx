import type { Budget } from '../types';
import { money } from '../utils/format';

interface Props {
  budget: Budget;
}

export default function BudgetCard({ budget }: Props) {
  return (
    <div className="budget-card">
      <p>{money(budget.limitAmount)} — {budget.month}/{budget.year}</p>
    </div>
  );
}
