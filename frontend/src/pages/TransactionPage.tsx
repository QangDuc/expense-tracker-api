import './TransactionPage.css';
import { FormEvent, useEffect, useState } from 'react';
import { z } from 'zod';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineFunnel } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { api, unwrap } from '../services/api';
import { money, errorOf } from '../utils/format';
import type { Category, Transaction } from '../types';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import type { Column } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { SkeletonRow } from '../components/ui/Skeleton';

type TransactionPageData = { items: Transaction[]; total: number; page: number; pageSize: number };

export default function TransactionPage() {
  const [list, setList] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const load = () => {
    setLoading(true);
    api
      .get('/transactions', {
        params: { keyword, page, pageSize, type: type || undefined },
      })
      .then((r) => unwrap<TransactionPageData>(r))
      .then((x) => {
        setList(x.items);
        setTotalPages(Math.ceil(x.total / pageSize) || 1);
      })
      .catch((e: unknown) => setError(errorOf(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api
      .get('/categories')
      .then((r) => unwrap<Category[]>(r))
      .then(setCategories);
  }, []);

  useEffect(() => {
    load();
  }, [keyword, type, page]);

  function getCategoryName(id: string) {
    return categories.find((c) => c.id === id)?.name || '—';
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const x = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = z
      .object({
        categoryId: z.string().uuid(),
        amount: z.coerce.number().positive(),
        title: z.string().min(1),
        date: z.string().min(1),
      })
      .safeParse(x);
    if (!parsed.success) return setError('Transaction không hợp lệ.');
    try {
      await api.post('/transactions', { ...parsed.data, note: x.note, type: Number(x.type) });
      e.currentTarget.reset();
      setModalOpen(false);
      toast.success('Đã thêm giao dịch!');
      load();
    } catch (e) {
      setError(errorOf(e));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/transactions/${deleteId}`);
      toast.success('Đã xóa giao dịch!');
      setDeleteId(null);
      load();
    } catch (e: unknown) {
      toast.error(errorOf(e));
      setDeleteId(null);
    }
  }

  const columns: Column<Transaction>[] = [
    {
      key: 'title',
      label: 'Tiêu đề',
      render: (t) => (
        <div className="tx-cell-title">
          <span className="tx-cell-name">{t.title}</span>
          {t.note && <span className="tx-cell-note">{t.note}</span>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (t) => <span className="tx-cell-cat">{getCategoryName(t.categoryId)}</span>,
    },
    {
      key: 'amount',
      label: 'Số tiền',
      align: 'right' as const,
      render: (t) => (
        <span className={`tx-cell-amount ${t.type === 0 ? 'income' : 'expense'}`}>
          {t.type === 0 ? '+' : '-'}{money(t.amount)}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Loại',
      render: (t) => (
        <Badge variant={t.type === 0 ? 'income' : 'expense'}>
          {t.type === 0 ? 'Thu nhập' : 'Chi tiêu'}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Ngày',
      render: (t) => (
        <span className="tx-cell-date">
          {new Date(t.date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      align: 'right' as const,
      render: (t) => (
        <button className="table-action-btn table-action-btn--danger" onClick={() => setDeleteId(t.id)}>
          <HiOutlineTrash />
        </button>
      ),
    },
  ];

  return (
    <div className="transaction-page">
      <PageHeader
        title="Giao dịch"
        subtitle="Quản lý các khoản thu chi"
        action={
          <Button icon={<HiOutlinePlus />} onClick={() => setModalOpen(true)}>
            Thêm mới
          </Button>
        }
      />

      {/* Filters */}
      <div className="transaction-page__filters">
        <SearchBar value={keyword} onChange={(v) => { setKeyword(v); setPage(1); }} placeholder="Tìm giao dịch…" />
        <div className="transaction-page__filter-select">
          <HiOutlineFunnel className="filter-icon" />
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">Tất cả</option>
            <option value="0">Thu nhập</option>
            <option value="1">Chi tiêu</option>
          </select>
        </div>
      </div>

      <Card padding="none">
        {loading ? (
          <div style={{ padding: '1rem' }}>
            {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            title="Chưa có giao dịch"
            description="Thêm giao dịch đầu tiên để theo dõi thu chi"
            actionLabel="Thêm giao dịch"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <Table columns={columns} data={list} rowKey={(t) => t.id} />
        )}
      </Card>

      {!loading && list.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {error && <p className="error-text" style={{ marginTop: '1rem' }}>{error}</p>}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm giao dịch" width="560px">
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="tx-title">Tiêu đề</label>
            <input id="tx-title" name="title" placeholder="Ví dụ: Lương tháng 7" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-category">Danh mục</label>
              <select id="tx-category" name="categoryId" required>
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tx-type">Loại</label>
              <select id="tx-type" name="type">
                <option value="1">Chi tiêu</option>
                <option value="0">Thu nhập</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-amount">Số tiền</label>
              <input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0" required />
            </div>
            <div className="form-group">
              <label htmlFor="tx-date">Ngày</label>
              <input id="tx-date" name="date" type="date" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="tx-note">Ghi chú</label>
            <input id="tx-note" name="note" placeholder="Ghi chú (tùy chọn)" />
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
          message="Bạn có chắc muốn xóa giao dịch này?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
