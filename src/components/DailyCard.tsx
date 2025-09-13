import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { DailyCardProps, TxRow } from '@/types';
import supabase, { removeTransaction } from '@/utils/supabase';
import TransactionForm from './TransactionForm';
import { Loader2Icon } from 'lucide-react';

export default function DailyCard({ dateISO }: DailyCardProps) {
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [add, setAdd] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!dateISO) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('transactions')
      .select(
        'id, user_id, amount, date, note, is_shared, type_id, created_at, updated_at, type:expense_types(name)'
      )
      .eq('date', dateISO)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro a buscar transações:', error.message);
      setTransactions([]);
    } else {
      const rows = (data ?? []).map((d: any) => ({
        ...d,
        type: Array.isArray(d.type) ? (d.type[0] ?? null) : (d.type ?? null),
      })) as TxRow[];
      setTransactions(rows);
    }

    setLoading(false);
  }, [dateISO]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRemove = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      await removeTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error('Erro a remover transação:', (e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const totalDia = useMemo(
    () => transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  const porTipo = useMemo(() => {
    const agg = new Map<string, number>();
    for (const t of transactions) {
      const key = t.type?.name ?? 'Sem tipo';
      agg.set(key, (agg.get(key) || 0) + Number(t.amount || 0));
    }
    return Array.from(agg.entries()).map(([name, total]) => ({ name, total }));
  }, [transactions]);

  return (
    <div className="w-full h-full items-center justify-center p-6">
      <section className="rounded-xl border bg-white/70 p-4 text-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Dia</span>
          <span className="font-mono tabular-nums">{dateISO ?? '—'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total do dia</span>
          <span className="font-medium">{totalDia.toFixed(2)} €</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4 text-muted-foreground">
            <Loader2Icon className="h-5 w-5 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <p>Sem movimentos neste dia</p>
        ) : (
          <>
            <h4 className="mt-2 font-semibold">Por tipo</h4>
            <div className="overflow-x-auto rounded-md border bg-white/80">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Tipo</th>
                    <th className="px-3 py-2 text-right">Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {porTipo.map((row) => (
                    <tr key={row.name} className="border-t">
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2 text-right">{row.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="mt-3 font-semibold">Movimentos</h4>
            <ul className="grid gap-2 text-muted-foreground">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span>
                    • {t.note || 'Sem descrição'} — {t.amount.toFixed(2)} €{' '}
                    {t.type?.name ? `(${t.type.name})` : ''}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === t.id}
                      onClick={() => handleRemove(t.id)}
                      aria-label="Remover movimento"
                    >
                      {deletingId === t.id ? 'A remover…' : 'Remover'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => setAdd(true)}>
            Adicionar
          </Button>

          {add && (
            <TransactionForm
              dateISO={dateISO}
              onClose={() => setAdd(false)}
              onSuccess={async () => {
                await fetchTransactions();
                setAdd(false);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
