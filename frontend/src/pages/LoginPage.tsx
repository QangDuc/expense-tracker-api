import './LoginPage.css';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import { api, unwrap } from '../services/api';
import { errorOf } from '../utils/format';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      password: string;
    };
    const valid = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse(data);
    if (!valid.success) return setError('Email hoặc mật khẩu không hợp lệ.');
    try {
      setLoading(true);
      setError('');
      const auth = unwrap<{ accessToken: string; refreshToken: string }>(
        await api.post('/auth/login', valid.data)
      );
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('refreshToken', auth.refreshToken);
      nav('/');
    } catch (e) {
      setError(errorOf(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="login-card__logo">
          <div className="login-card__logo-icon">ET</div>
        </div>
        <h1 className="login-card__title">Expense Tracker Pro</h1>
        <p className="login-card__subtitle">Đăng nhập để quản lý chi tiêu</p>

        <form onSubmit={submit} className="login-card__form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="login-card__input-wrap">
              <HiOutlineEnvelope className="login-card__input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className={error ? 'error' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="login-card__input-wrap">
              <HiOutlineLockClosed className="login-card__input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                minLength={6}
                className={error ? 'error' : ''}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng nhập
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
