import type { Transaction } from '../types';
import { money } from '../utils/format';

interface Props {
  items: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionTable({ items, onDelete }: Props) {
  return (
    <div>
      {items.map((x) => (
        <p key={x.id}>
          {x.title} — {money(x.amount)}{' '}
          <button onClick={() => onDelete(x.id)}>Delete</button>
        </p>
      ))}
    </div>
  );
}
