import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Calendario from './Calendario';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';
import { fetchAllTransactions, monthNames } from '@/utils/supabase';
import type { TxRow } from '@/types';
import { WalletIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthlyLineChart } from '@/components/charts';
import MonthlyPieChart from '@/components/charts/type/CategoryPieChart';

const Personal = () => {
  const [add, setAdd] = useState(false);
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [total, setTotal] = useState<number>(0); // total do ano (cursor)
  const [totalMes, setTotalMes] = useState<number>(0); // total do mês (cursor)

  // Cursor de mês/ano (navegação)
  const [cursor, setCursor] = useState<Date>(() => new Date());
  const month = cursor.getMonth() + 1; // 1..12
  const year = cursor.getFullYear();

  const shiftMonth = (delta: number) => {
    const d = new Date(cursor);
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);
    setCursor(d);
  };

  useEffect(() => {
    (async () => {
      const allTx = await fetchAllTransactions();
      setTransactions(allTx);

      // total do ano selecionado
      const somaAno = allTx
        .filter((t) => new Date(t.date).getFullYear() === year)
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      // total do mês selecionado
      const somaMes = allTx
        .filter((t) => {
          const d = new Date(t.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        })
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      setTotal(somaAno);
      setTotalMes(somaMes);
    })();
  }, [month, year]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand text-black pt-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header com navegação de mês à esquerda e totais à direita */}
          <div className="flex items-center justify-between pt-4">
            {/* Navegação de mês */}
            <div className="flex items-center justify-left gap-2 box-card shadow-sm p-2 w-fit rounded-lg bg-gray-900 text-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => shiftMonth(-1)}
                aria-label="Mês anterior"
                className="h-8 w-8 rounded-full hover:shadow active:scale-95 transition"
              >
                ‹
              </Button>

              <span className="font-semibold">
                {monthNames[month - 1]} de {year}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => shiftMonth(1)}
                aria-label="Mês seguinte"
                className="h-8 w-8 rounded-full hover:shadow active:scale-95 transition"
              >
                ›
              </Button>
            </div>

            {/* Totais */}
            <div className="flex items-center gap-3 rounded-lg border bg-brand-light shadow px-3 p-2">
              <WalletIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Mês:</span>
              <span className="text-base font-bold text-red-700">{totalMes.toFixed(2)} €</span>
              <span className="text-sm font-medium text-gray-700">Ano:</span>
              <span className="text-base font-bold text-red-700">{total.toFixed(2)} €</span>
            </div>
          </div>

          <section className="grid grid-cols-12 gap-6 items-start pt-4">
            {/* Coluna ESQUERDA (gráficos) */}
            <div className="col-span-12 md:col-span-7 space-y-6">
              {/* Linha */}
              <div className="bg-brand-bg rounded-xl shadow p-3">
                <MonthlyLineChart
                  className="w-full"
                  height={180}
                  month={month}
                  year={year}
                  transactions={transactions}
                />
              </div>

              {/* Pizza */}
              <div className="bg-brand-bg rounded-xl shadow p-3">
                <div className="mb-2 text-sm text-muted-foreground">
                  {`${monthNames[month - 1]} de ${year} · Distribuição por tipo`}
                </div>
                <MonthlyPieChart
                  month={month}
                  year={year}
                  transactions={transactions}
                  height={260}
                  className="w-full"
                />
              </div>
            </div>

            <aside className="col-span-12 md:col-span-5 md:row-span-2 flex flex-col items-center gap-4">
              <div className="bg-brand-bg rounded-xl shadow p-4 min-h-[450px] md:min-h-[450px] w-full flex items-center justify-center">
                <div style={{ zoom: 1.25 }}>
                  <Calendario />
                </div>
              </div>

              <Button variant="outline" onClick={() => setAdd(!add)}>
                {add ? 'Fechar' : 'Adicionar'}
              </Button>

              {add && (
                <div className="w-full">
                  <TransactionForm
                    onClose={() => setAdd(false)}
                    onSuccess={async () => {
                      const updated = await fetchAllTransactions();
                      setTransactions(updated);

                      const somaAno = updated
                        .filter((t) => new Date(t.date).getFullYear() === year)
                        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

                      const somaMes = updated
                        .filter((t) => {
                          const d = new Date(t.date);
                          return d.getFullYear() === year && d.getMonth() + 1 === month;
                        })
                        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

                      setTotal(somaAno);
                      setTotalMes(somaMes);

                      setAdd(false);
                    }}
                  />
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </>
  );
};

export default Personal;
