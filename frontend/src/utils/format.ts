export const money = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const errorOf = (e: unknown): string => {
  const err = e as { response?: { data?: { title?: string; message?: string } } };
  return err?.response?.data?.title || err?.response?.data?.message || 'Không thể lưu thay đổi.';
};
