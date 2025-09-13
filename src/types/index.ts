export type ISODate = `${number}-${number}${number}-${number}${number}`;

export type DailyCardProps = { dateISO: ISODate };

export type ExpenseType = {
  id: string;
  name: string;
  owner_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TxRow = {
  id: string;
  user_id: string;
  amount: number;
  date: ISODate;
  note: string | null;
  is_shared: boolean;
  type_id: string | null;
  created_at: string;
  updated_at: string;
  type?: { name: string } | null;
};

export type WithCloseAndSuccess = {
  onClose: () => void;
  onSuccess: () => void;
};

export type TransactionFormProps = {
  dateISO?: ISODate;
  onClose: () => void;
  onSuccess: () => void;
};

export type MonthlyLineChartProps = {
  month?: number;
  year?: number;
  transactions?: TxRow[];
  className?: string;
  currencySymbol?: string;
  width?: number | string;
  height?: number | string;
};

export type MonthlyPieChartProps = {
  month?: number;
  year?: number;
  transactions?: TxRow[];
  types?: ExpenseType[];
  height?: number;
  className?: string;
};

export type CategoryProps = {
  label: string;
  image: string; // se usares imports tipo `import img from '@/assets/x.png'` podes trocar para string | undefined
  imgClass?: string;
  to: string;
};
