import './CategoryPage.css';
import { FormEvent, useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { api, unwrap } from '../services/api';
import { errorOf } from '../utils/format';
import { categorySchema } from '../utils/schemas';
import type { Category } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import type { Column } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonRow } from '../components/ui/Skeleton';

export default function CategoryPage() {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get('/categories')
      .then((r) => unwrap<Category[]>(r))
      .then(setList)
      .catch((e: unknown) => setError(errorOf(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const v = categorySchema.parse(Object.fromEntries(new FormData(e.currentTarget)));
      await api.post('/categories', v);
      e.currentTarget.reset();
      setModalOpen(false);
      toast.success('Đã thêm danh mục!');
      load();
    } catch (e) {
      setError(errorOf(e));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Đã xóa danh mục!');
      setDeleteId(null);
      load();
    } catch (e: unknown) {
      toast.error(errorOf(e));
      setDeleteId(null);
    }
  }

  const columns: Column<Category>[] = [
    {
      key: 'color',
      label: '',
      width: '40px',
      render: (c) => (
        <span className="category-swatch" style={{ background: c.color }} />
      ),
    },
    {
      key: 'name',
      label: 'Tên danh mục',
      render: (c) => <span className="category-name">{c.name}</span>,
    },
    {
      key: 'type',
      label: 'Loại',
      render: (c) => (
        <Badge variant={c.type === 0 ? 'income' : 'expense'}>
          {c.type === 0 ? 'Thu nhập' : 'Chi tiêu'}
        </Badge>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (c) => <span className="category-icon-cell">{c.icon}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      align: 'right' as const,
      render: (c) => (
        <button className="table-action-btn table-action-btn--danger" onClick={() => setDeleteId(c.id)}>
          <HiOutlineTrash />
        </button>
      ),
    },
  ];

  return (
    <div className="category-page">
      <PageHeader
        title="Danh mục"
        subtitle="Quản lý các danh mục thu chi"
        action={
          <Button icon={<HiOutlinePlus />} onClick={() => setModalOpen(true)}>
            Thêm mới
          </Button>
        }
      />

      <Card padding="none">
        {loading ? (
          <div style={{ padding: '1rem' }}>
            {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            title="Chưa có danh mục"
            description="Tạo danh mục đầu tiên để bắt đầu phân loại thu chi"
            actionLabel="Thêm danh mục"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <Table columns={columns} data={list} rowKey={(c) => c.id} />
        )}
      </Card>

      {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm danh mục">
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="cat-name">Tên danh mục</label>
            <input id="cat-name" name="name" placeholder="Ví dụ: Ăn uống" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cat-type">Loại</label>
              <select id="cat-type" name="type">
                <option value="0">Thu nhập</option>
                <option value="1">Chi tiêu</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cat-icon">Icon</label>
              <input id="cat-icon" name="icon" defaultValue="tag" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cat-color">Màu sắc</label>
            <input id="cat-color" name="color" type="color" defaultValue="#2563EB" className="color-input" />
          </div>
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button type="submit">Thêm</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDialog
          message="Bạn có chắc muốn xóa danh mục này?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
