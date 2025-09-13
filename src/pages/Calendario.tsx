'use client';
import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DailyCard from '@/components/DailyCard';
import type { ISODate } from '@/types';

const fmtLocal = (d: Date): ISODate =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
    2,
    '0'
  )}` as ISODate;

export default function Calendario() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

  const dateISO = selected ? fmtLocal(selected) : undefined;

  return (
    <>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(d) => {
          setSelected(d);
          if (d) setOpen(true);
        }}
        captionLayout="dropdown"
        className="rounded-md border shadow-sm"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-2">Resumo do dia {dateISO}</DialogTitle>
          </DialogHeader>

          {dateISO && <DailyCard dateISO={dateISO} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
