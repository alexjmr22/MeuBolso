import { createClient } from '@supabase/supabase-js';
import type { TxRow, ExpenseType } from '@/types';

const supabaseurl = "https://bdhzypiexottabgbjqst.supabase.co";
const supabaseAnonKey  = "sb_publishable_rZf9S0jBuxOisqPAYuytag_ubl1vxxk";

const supabase = createClient(supabaseurl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

/* -------------------- TRANSAÇÕES -------------------- */

export type AddTxInput = Omit<TxRow, 'id' | 'created_at' | 'updated_at' | 'type'>;

export async function fetchAllTransactions(): Promise<TxRow[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar transações:', error.message);
    return [];
  }
  return (data ?? []) as TxRow[];
}

export async function addTransaction(tx: AddTxInput) {
  const { error } = await supabase.from('transactions').insert([tx]);
  if (error) throw new Error(error.message);
}

export async function removeTransaction(id: string) {
  const { data: userData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !userData?.user) throw new Error('Sem utilizador autenticado.');

  const user_id = userData.user.id;

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id); // bate certo com a RLS típica

  if (error) throw new Error(error.message);
}

/* -------------------- TIPOS -------------------- */

export async function fetchActiveTypes(): Promise<ExpenseType[]> {
  const { data, error } = await supabase
    .from('expense_types')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ExpenseType[];
}

export async function createOrGetTypeId(
  name: string,
  owner_id: string,
  current: ExpenseType[]
): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const existing = current.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('expense_types')
    .insert([{ name: trimmed, owner_id }])
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data!.id as string;
}

export const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const DEFAULT_PALETTE = [
  '#f59e0b', // laranja
  '#fbbf24', // amarelo
  '#ef4444', // vermelho
  '#6b7280', // cinza
  '#10b981', // verde
  '#3b82f6', // azul
  '#8b5cf6', // roxo
  '#ec4899', // rosa
  '#f97316', // laranja escuro
  '#84cc16', // lima
  '#14b8a6', // teal
  '#eab308', // dourado
];

export function useChartPalette(): string[] {
  return DEFAULT_PALETTE;
}


export default supabase;
