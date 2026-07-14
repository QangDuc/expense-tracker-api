import type { Category } from '../types';
import { money } from '../utils/format';

interface Props {
  items: Category[];
  onDelete: (id: string) => void;
}

export default function CategoryTable({ items, onDelete }: Props) {
  return (
    <div>
      {items.map((x) => (
        <p key={x.id}>
          {x.name} <button onClick={() => onDelete(x.id)}>Delete</button>
        </p>
      ))}
    </div>
  );
}
