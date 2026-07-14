import './ProfilePage.css';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api, unwrap } from '../services/api';
import { errorOf } from '../utils/format';
import { profileSchema } from '../utils/schemas';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';

type ProfileData = { fullName: string; avatar?: string };

export default function ProfilePage() {
  const [p, setP] = useState<ProfileData>();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/profile')
      .then((r) => unwrap<ProfileData>(r))
      .then(setP)
      .catch((e: unknown) => setError(errorOf(e)));
  }, []);

  if (!p && !error) {
    return (
      <div className="profile-page">
        <PageHeader title="Hồ sơ" subtitle="Quản lý thông tin cá nhân" />
        <Card className="profile-card">
          <div className="profile-card__avatar-section">
            <Skeleton width="80px" height="80px" radius="50%" />
          </div>
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="20px" />
        </Card>
      </div>
    );
  }

  if (error && !p) return <p className="error-text" style={{ padding: '2rem' }}>{error}</p>;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setSaving(true);
      const x = profileSchema.parse(Object.fromEntries(new FormData(e.currentTarget)));
      const result = await api.put('/profile', x);
      setP(unwrap<ProfileData>(result));
      toast.success('Đã cập nhật hồ sơ!');
    } catch (e) {
      setError(errorOf(e));
      toast.error('Không thể cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <PageHeader title="Hồ sơ" subtitle="Quản lý thông tin cá nhân" />

      <Card className="profile-card">
        {/* Avatar section */}
        <div className="profile-card__avatar-section">
          <Avatar src={p?.avatar} name={p?.fullName} size="xl" />
          <div className="profile-card__user-info">
            <h2 className="profile-card__name">{p?.fullName}</h2>
            <p className="profile-card__role">Thành viên</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="profile-card__form">
          <div className="form-group">
            <label htmlFor="prf-fullname">Họ và tên</label>
            <input id="prf-fullname" name="fullName" defaultValue={p?.fullName} required />
          </div>
          <div className="form-group">
            <label htmlFor="prf-avatar">Avatar URL</label>
            <input id="prf-avatar" name="avatar" defaultValue={p?.avatar || ''} placeholder="https://example.com/avatar.jpg" />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="profile-card__actions">
            <Button type="submit" loading={saving}>Lưu thay đổi</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
