import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { DailyCardProps, TxRow } from '@/types';
import supabase from '@/utils/supabase';

export default function DailyCard({ dateISO }: DailyCardProps) {
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
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
    }

    if (dateISO) fetchTransactions();
  }, [dateISO]);

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
          <p>Carregando…</p>
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
                <li key={t.id}>
                  • {t.note || 'Sem descrição'} — {t.amount.toFixed(2)} €{' '}
                  {t.type?.name ? `(${t.type.name})` : ''}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm">
            Adicionar
          </Button>
          <Button size="sm">Editar</Button>
        </div>
      </section>
    </div>
  );
}
