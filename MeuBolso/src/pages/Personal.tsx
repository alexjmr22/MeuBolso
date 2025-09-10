import Navbar from '@/components/Navbar';
import { useState } from 'react';
import Calendario from './Calendario';
import { Button } from '@/components/ui/button';
import TransactionForm from '@/components/TransactionForm';

const Personal = () => {
  const [add, setAdd] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand text-black pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="w-fit rounded-md border border-black/10 bg-white/60 px-10 py-3 text-2xl font-semibold mb-6">
            Conta Pessoal
          </h1>

          <section className="grid grid-cols-1 md:grid-cols-[1fr,1.2fr] gap-10 items-start">
            <div className="space-y-4 relative">
              <Button variant="outline" onClick={() => setAdd(!add)}>
                {add ? 'Fechar' : 'Adicionar gasto'}
              </Button>

              {add && (
                <TransactionForm onClose={() => setAdd(false)} onSuccess={() => setAdd(false)} />
              )}
            </div>

            <div className="flex justify-end">
              <div className="rounded-xl border bg-white p-3 shadow-sm">
                <Calendario />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Personal;
