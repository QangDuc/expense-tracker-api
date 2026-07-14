import Modal from './ui/Modal';
import Button from './ui/Button';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <Modal open={true} onClose={onCancel} title="Xác nhận">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          fontSize: '1.75rem',
          marginBottom: '1rem',
        }}>
          <HiOutlineExclamationTriangle />
        </div>
        <p style={{
          fontSize: 'var(--font-sm)',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={onCancel}>Hủy</Button>
          <Button variant="danger" onClick={onConfirm}>Xóa</Button>
        </div>
      </div>
    </Modal>
  );
}
