import './BudgetPage.css';
import { FormEvent, useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { api, unwrap } from '../services/api';
import { money, errorOf } from '../utils/format';
import { budgetSchema } from '../utils/schemas';
import type { Budget, Category } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function BudgetPage() {
  const [list, setList] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get('/budgets')
      .then((r) => unwrap<Budget[]>(r))
      .then(setList)
      .catch((e: unknown) => setError(errorOf(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api
      .get('/categories')
      .then((r) => unwrap<Category[]>(r))
      .then(setCategories);
  }, []);

  function getCategoryName(id: string) {
    return categories.find((c) => c.id === id)?.name || 'Không rõ';
  }

  function getCategoryColor(id: string) {
    return categories.find((c) => c.id === id)?.color || '#2563EB';
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const x = budgetSchema.parse(Object.fromEntries(new FormData(e.currentTarget)));
      await api.post('/budgets', x);
      setModalOpen(false);
      toast.success('Đã thêm ngân sách!');
      load();
    } catch (e) {
      setError(errorOf(e));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/budgets/${deleteId}`);
      toast.success('Đã xóa ngân sách!');
      setDeleteId(null);
      load();
    } catch (e: unknown) {
      toast.error(errorOf(e));
      setDeleteId(null);
    }
  }

  const months = ['', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  return (
    <div className="budget-page">
      <PageHeader
        title="Ngân sách"
        subtitle="Thiết lập giới hạn chi tiêu theo tháng"
        action={
          <Button icon={<HiOutlinePlus />} onClick={() => setModalOpen(true)}>
            Thêm mới
          </Button>
        }
      />

      {loading ? (
        <div className="budget-page__grid">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            title="Chưa có ngân sách"
            description="Tạo ngân sách đầu tiên để kiểm soát chi tiêu"
            actionLabel="Thêm ngân sách"
            onAction={() => setModalOpen(true)}
          />
        </Card>
      ) : (
        <div className="budget-page__grid">
          {list.map((b) => (
            <Card key={b.id} padding="md" hover className="budget-card">
              <div className="budget-card__header">
                <div className="budget-card__cat">
                  <span className="budget-card__dot" style={{ background: getCategoryColor(b.categoryId) }} />
                  <span className="budget-card__cat-name">{getCategoryName(b.categoryId)}</span>
                </div>
                <button className="table-action-btn table-action-btn--danger" onClick={() => setDeleteId(b.id)}>
                  <HiOutlineTrash />
                </button>
              </div>
              <div className="budget-card__amount">{money(b.limitAmount)}</div>
              <div className="budget-card__period">{months[b.month]} {b.year}</div>
              <ProgressBar value={50} max={100} size="sm" showPercent={false} />
            </Card>
          ))}
        </div>
      )}

      {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm ngân sách">
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="bgt-category">Danh mục</label>
            <select id="bgt-category" name="categoryId" required>
              <option value="">Chọn danh mục</option>
              {categories.map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bgt-limit">Giới hạn</label>
            <input id="bgt-limit" name="limitAmount" type="number" min="0.01" step="0.01" placeholder="Nhập số tiền" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bgt-month">Tháng</label>
              <select id="bgt-month" name="month" required>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                  <option key={m} value={m}>{months[m]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bgt-year">Năm</label>
              <input id="bgt-year" name="year" type="number" defaultValue={new Date().getFullYear()} />
            </div>
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
          message="Bạn có chắc muốn xóa ngân sách này?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
