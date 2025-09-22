import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Calendario from './Calendario';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';
import { fetchAllTransactions, monthNames } from '@/utils/supabase';
import type { TxRow } from '@/types';
import { WalletIcon } from 'lucide-react';
import { MonthlyLineChart } from '@/components/charts';
import MonthlyPieChart from '@/components/charts/type/CategoryPieChart';

const Personal = () => {
  const [add, setAdd] = useState(false);
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalMes, setTotalMes] = useState<number>(0);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  //para fazer quando criar botao para ver outros meses
  // function nextMonth() {
  //   if (month === 12) {
  //     setMonth(1);
  //     setYear(year + 1);
  //   } else setMonth(month + 1);
  // }

  // function prevMonth() {
  //   if (month === 1) {
  //     setMonth(12);
  //     setYear(year - 1);
  //   } else setMonth(month - 1);
  // }

  useEffect(() => {
    (async () => {
      const allTx = await fetchAllTransactions();
      setTransactions(allTx);

      const somaTotal = allTx.reduce((acc, t) => acc + Number(t.amount || 0), 0);
      setTotal(somaTotal);

      const now = new Date();
      const mesAtual = now.getMonth();
      const anoAtual = now.getFullYear();

      const txMes = allTx.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      });

      const somaMes = txMes.reduce((acc, t) => acc + Number(t.amount || 0), 0);
      setTotalMes(somaMes);

      console.log('Total global:', somaTotal);
      console.log('Transações do mês:', txMes);
      console.log('Total do mês:', somaMes);
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand text-black pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border bg-brand-light shadow px-3 py-2 w-fit">
              <WalletIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Total do mês:</span>
              <span className="text-base font-bold text-red-700">{totalMes.toFixed(2)} €</span>
              <span className="text-sm font-medium text-gray-700">Total do ano:</span>
              <span className="text-base font-bold text-red-700">{total.toFixed(2)} €</span>
            </div>
          </div>

          <section className="grid grid-cols-12 gap-6 items-start pt-6">
            {/* Coluna ESQUERDA (gráficos) */}
            <div className="col-span-12 md:col-span-7 space-y-6">
              {/* Linha */}
              <div className="bg-brand-bg rounded-xl shadow p-3">
                <MonthlyLineChart className="w-full" height={180} />
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
              <div className="bg-brand-bg rounded-xl shadow p-4 min-h-[450px] md:min-h-[450x] w-full flex items-center justify-center">
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
                      setTransactions(updated); // atualiza a lista
                      setAdd(false); // fecha o modal
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
