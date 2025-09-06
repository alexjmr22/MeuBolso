export type Profile = { id: string; nome: string; pin_hash: string }; //vai mudar
export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  date: string;
  note: string | null;
  is_shared: boolean;
  created_at: string;
};
export type CategoryProps = {
  label: string;
  image: string;
  imgClass: string;
  to: string;
};

export type ISODate = `${number}-${number}${number}-${number}${number}`;
export type DailyCardProps = { dateISO: ISODate };

