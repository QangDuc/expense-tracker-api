import './Loading.css';

export default function Loading({ text = 'Đang tải…' }: { text?: string }) {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <span className="loading__text">{text}</span>
    </div>
  );
}
