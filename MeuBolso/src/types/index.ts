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
