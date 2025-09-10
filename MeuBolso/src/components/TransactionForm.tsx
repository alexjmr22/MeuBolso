import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import supabase from '@/utils/supabase';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import type { ExpenseType } from '@/types';

type TransactionFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | ''>('');
  const [newTypeName, setNewTypeName] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro a carregar tipos:', error.message);
      } else {
        setTypes((data ?? []) as ExpenseType[]);
      }
    })();
  }, []);

  const hasNewTypeName = useMemo(() => newTypeName.trim().length > 0, [newTypeName]);

  async function createTypeIfNeeded(user_id: string): Promise<string | null> {
    if (!hasNewTypeName) return selectedTypeId || null;

    const exists = types.some(
      (t) => t.name.toLocaleLowerCase() === newTypeName.trim().toLocaleLowerCase()
    );
    if (exists) {
      const t = types.find(
        (x) => x.name.toLocaleLowerCase() === newTypeName.trim().toLocaleLowerCase()
      )!;
      return t.id;
    }

    const { data, error } = await supabase
      .from('expense_types')
      .insert([{ name: newTypeName.trim(), owner_id: user_id }])
      .select('id')
      .single();

    if (error) {
      console.error('Erro a criar tipo:', error.message);
      return null;
    }

    setTypes((prev) => [
      ...prev,
      {
        ...(data as any),
        name: newTypeName.trim(),
        owner_id: user_id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    setNewTypeName('');
    setSelectedTypeId(data!.id);
    return data!.id;
  }

  async function handleSubmit() {
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      console.error('Valor inválido');
      return;
    }

    setLoading(true);
    const { data: userData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !userData?.user) {
      console.error('Sem utilizador autenticado.');
      setLoading(false);
      return;
    }
    const user_id = userData.user.id;

    const type_id = await createTypeIfNeeded(user_id);

    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('transactions').insert([
      {
        user_id,
        amount: value,
        date: today,
        note: note.trim() || null,
        is_shared: false,
        type_id: type_id ?? null,
      },
    ]);

    if (error) {
      console.error('Erro ao adicionar transação:', error.message);
    } else {
      console.log('✅ Transação adicionada com sucesso!');
      setAmount('');
      setNote('');
      setSelectedTypeId('');
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-4 shadow-xl">
          <h2 className="mb-3 text-lg font-semibold">Nova transação</h2>

          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Valor (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tipo</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
              >
                <option value="">— Sem tipo —</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Criar novo tipo (opcional)</label>
              <Input
                type="text"
                placeholder="Ex.: Alimentação fora, Ginásio…"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Se preencher este campo, será criado um tipo pessoal e usado nesta transação.
              </p>
            </div>

            <Input
              type="text"
              placeholder="Nota"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !amount}
                className="inline-flex items-center gap-2"
              >
                {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                {!loading && <PlusIcon className="h-4 w-4" />}
                {loading ? 'A adicionar…' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
