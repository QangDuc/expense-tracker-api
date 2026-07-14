import './Header.css';
import { HiOutlineBell, HiBars3 } from 'react-icons/hi2';
import Avatar from './ui/Avatar';
import { useEffect, useState } from 'react';
import { api, unwrap } from '../services/api';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    api
      .get('/profile')
      .then((r) => unwrap<{ fullName: string }>(r))
      .then((p) => setUserName(p.fullName || 'User'))
      .catch(() => {});
  }, []);

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Menu">
          <HiBars3 />
        </button>
      </div>
      <div className="app-header__right">
        <button className="app-header__notification" aria-label="Notifications">
          <HiOutlineBell />
          <span className="app-header__notif-dot" />
        </button>
        <div className="app-header__user">
          <Avatar name={userName} size="sm" />
          <span className="app-header__user-name">{userName}</span>
        </div>
      </div>
    </header>
  );
}
