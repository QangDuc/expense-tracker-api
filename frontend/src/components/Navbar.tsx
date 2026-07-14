import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineChartPie,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

interface NavbarProps {
  open?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: <HiOutlineHome /> },
  { to: '/categories', label: 'Categories', icon: <HiOutlineTag /> },
  { to: '/transactions', label: 'Transactions', icon: <HiOutlineBanknotes /> },
  { to: '/budgets', label: 'Budgets', icon: <HiOutlineChartPie /> },
  { to: '/profile', label: 'Profile', icon: <HiOutlineUser /> },
];

export default function Navbar({ open, onClose }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <nav className={`navbar ${open ? 'navbar--open' : ''}`}>
      {/* Logo */}
      <div className="navbar__logo">
        <div className="navbar__logo-icon">ET</div>
        <span className="navbar__logo-text">Expense Tracker Pro</span>
      </div>

      {/* Navigation */}
      <div className="navbar__menu">
        <span className="navbar__section-label">Menu</span>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`navbar__link ${isActive(item.to) ? 'navbar__link--active' : ''}`}
            onClick={onClose}
          >
            <span className="navbar__link-icon">{item.icon}</span>
            <span className="navbar__link-text">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="navbar__footer">
        <button className="navbar__logout" onClick={handleLogout}>
          <span className="navbar__link-icon"><HiOutlineArrowRightOnRectangle /></span>
          <span className="navbar__link-text">Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
}
