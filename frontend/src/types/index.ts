export type Category = {
  id: string;
  name: string;
  type: number;
  icon: string;
  color: string;
};

export type Transaction = {
  id: string;
  categoryId: string;
  amount: number;
  title: string;
  note?: string;
  date: string;
  type: number;
};

export type Budget = {
  id: string;
  categoryId: string;
  limitAmount: number;
  month: number;
  year: number;
};
