import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import supabase, { addTransaction, fetchActiveTypes, createOrGetTypeId } from '@/utils/supabase';
import { Loader2Icon } from 'lucide-react';
import type { ExpenseType, TransactionFormProps } from '@/types';

export default function TransactionForm({ dateISO, onClose, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [newTypeName, setNewTypeName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchActiveTypes();
        setTypes(data);
      } catch (e) {
        console.error('Erro a carregar tipos:', (e as Error).message);
      }
    })();
  }, []);

  const hasNewTypeName = useMemo(() => newTypeName.trim().length > 0, [newTypeName]);

  async function handleSubmit() {
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      console.error('Valor inválido');
      return;
    }
    setLoading(true);
    try {
      const { data: userData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !userData?.user) {
        console.error('Sem utilizador autenticado.');
        return;
      }
      const user_id = userData.user.id;

      const type_id = hasNewTypeName
        ? await createOrGetTypeId(newTypeName, user_id, types)
        : selectedTypeId || null;

      // fallback para hoje se dateISO não vier (o teu tipo é template, por isso fazemos cast)
      const today = new Date().toISOString().slice(0, 10) as any;

      await addTransaction({
        user_id,
        amount: value,
        date: dateISO ?? today,
        note: note.trim() || null,
        is_shared: false,
        type_id: type_id ?? null,
      });

      if (hasNewTypeName && type_id) {
        // mantém a lista local coerente
        setTypes((prev) => [
          ...prev,
          {
            id: type_id,
            name: newTypeName.trim(),
            owner_id: user_id,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setNewTypeName('');
        setSelectedTypeId(type_id);
      }

      setAmount('');
      setNote('');
      onSuccess();
    } catch (e) {
      console.error('Erro ao adicionar transação:', (e as Error).message);
    } finally {
      setLoading(false);
    }
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
                {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Adicionar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
