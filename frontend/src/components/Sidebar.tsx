import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/">Dashboard</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/profile">Profile</Link>
    </aside>
  );
}
