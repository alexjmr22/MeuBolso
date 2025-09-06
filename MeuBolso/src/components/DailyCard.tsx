'use client';
import { Button } from '@/components/ui/button';
import type { DailyCardProps } from '@/types';

export default function DailyCard({ dateISO }: DailyCardProps) {
  return (
    <div className="w-full h-full items-center justify-center p-6">
      <section className="rounded-xl border bg-white/70 p-4 text-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Dia</span>
          <span className="font-mono tabular-nums">{dateISO ?? '—'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total do dia</span>
          <span className="font-medium">0,00 €</span>
        </div>

        <ul className="mt-2 grid gap-2 text-muted-foreground">
          <li>• Exemplo de movimento 1 — 0,00 €</li>
          <li>• Exemplo de movimento 2 — 0,00 €</li>
        </ul>

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
