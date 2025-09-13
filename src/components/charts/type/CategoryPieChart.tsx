'use client';

import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { ExpenseType, MonthlyPieChartProps } from '@/types';
import { fetchActiveTypes, monthNames, useChartPalette } from '@/utils/supabase';

const COLORS = useChartPalette();

export default function MonthlyPieChart({
  month,
  year,
  transactions = [],
  types,
  height = 220,
  className,
}: MonthlyPieChartProps) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  // Se não receber tipos por props, busca os ativos
  const [localTypes, setLocalTypes] = useState<ExpenseType[] | null>(types ?? null);
  useEffect(() => {
    if (types) return;
    (async () => {
      try {
        const t = await fetchActiveTypes();
        setLocalTypes(t);
      } catch (e) {
        console.error('Erro a buscar tipos:', e);
        setLocalTypes([]);
      }
    })();
  }, [types]);

  const typeMap = useMemo(() => {
    const list = types ?? localTypes ?? [];
    return new Map(list.map((t) => [t.id, t.name]));
  }, [types, localTypes]);

  // agrega por nome de tipo (via type_id)
  const { data, total } = useMemo(() => {
    const agg = new Map<string, number>();

    for (const t of transactions) {
      const d = new Date(t.date as unknown as string);
      if (d.getFullYear() !== y || d.getMonth() + 1 !== m) continue;

      const nameFromMap = typeMap.get(t.type_id ?? '') ?? '';
      const key = nameFromMap.trim() || 'Outros';

      agg.set(key, (agg.get(key) || 0) + Number(t.amount || 0));
    }

    const arr = Array.from(agg, ([name, total]) => ({ name, total }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      data: arr,
      total: arr.reduce((a, x) => a + x.total, 0),
    };
  }, [transactions, m, y, typeMap]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center ${className ?? ''}`} style={{ height }}>
        <p className="text-sm text-muted-foreground">
          Sem dados para {monthNames[m - 1]} de {y}.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: any, _name, { payload }) => {
              const v = Number(value || 0);
              const pct = total ? (v / total) * 100 : 0;
              return [`€${v.toLocaleString('pt-PT')}`, `${payload.name} (${pct.toFixed(1)}%)`];
            }}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
