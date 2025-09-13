'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MonthlyLineChartProps, TxRow } from '@/types';
import { fetchAllTransactions, monthNames } from '@/utils/supabase';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';



type Point = { day: number; total: number };

function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

export default function MonthlyLineChart({
  month,
  year,
  transactions,
  className,
  currencySymbol = '€',
  height = 200,
}: MonthlyLineChartProps) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const [allTx, setAllTx] = useState<TxRow[] | null>(transactions ?? null);
  const [loading, setLoading] = useState<boolean>(!transactions);

  const nDays = daysInMonth(y, m);
  const ticks = useMemo(() => Array.from({ length: nDays }, (_, i) => i + 1), [nDays]);

  useEffect(() => {
    if (transactions) return;
    (async () => {
      setLoading(true);
      const data = await fetchAllTransactions();
      setAllTx(data);
      setLoading(false);
    })();
  }, [transactions]);

  const data: Point[] = useMemo(() => {
    const nDays = daysInMonth(y, m);
    const base: Point[] = Array.from({ length: nDays }, (_, i) => ({
      day: i + 1,
      total: 0,
    }));

    const source = transactions ?? allTx ?? [];
    for (const t of source) {
      const d = new Date(t.date as unknown as string);
      if (d.getFullYear() !== y || d.getMonth() + 1 !== m) continue;
      const idx = d.getDate() - 1;
      if (idx >= 0 && idx < base.length) base[idx].total += Number(t.amount || 0);
    }
    return base;
  }, [allTx, transactions, m, y]);

  if (loading) {
    return (
      <div className={`w-full rounded-xl border ${className ?? ''}`}>
        <div className="w-full h-[200px] animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 text-sm text-muted-foreground">
        {`${monthNames[m - 1]} de ${y}`}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            type="number"
            domain={[1, nDays]}
            ticks={ticks}
            interval={0}
            allowDecimals={false}
            tick={{ fontSize: 10 }}
            tickMargin={6}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              `${currencySymbol}${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            }
          />
          <Tooltip
            formatter={(value: number) =>
              `${currencySymbol}${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            }
            labelFormatter={(label) => `Dia ${label}`}
            wrapperStyle={{ fontSize: 10 }}
            labelStyle={{ fontSize: 10 }}
            itemStyle={{ fontSize: 10 }}
          />

          <Line type="monotone" dataKey="total" strokeWidth={2} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
