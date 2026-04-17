'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';

// Simple SVG icons (inline, no lucide-react)
const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

export type CalendarProps = {
  className?: string;
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  disabled?: boolean;
  showOutsideDays?: boolean;
  mode?: 'single' | 'range';
};

export function Calendar({
  className,
  selected,
  onSelect,
  disabled = false,
  showOutsideDays = true,
  mode = 'single',
}: Readonly<CalendarProps>) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);

  const selectedDate = useMemo(() => {
    if (!selected) return null;
    if (selected instanceof Date) return selected;
    if (Array.isArray(selected)) return selected[0];
    if ('from' in selected && selected.from) return selected.from;
    return null;
  }, [selected]);

  const selectedRange = useMemo(() => {
    if (mode === 'range' && selected && 'from' in selected) {
      return { from: selected.from, to: selected.to };
    }
    return null;
  }, [selected, mode]);

  // Calendar logic
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay()); // Start from Sunday

  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(startDate);
  while (current <= endOfMonth || days.length % 7 !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2?.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isInRange = (date: Date) => {
    if (!selectedRange?.from) return false;
    const from = selectedRange.from;
    const to = selectedRange.to || from;
    return date >= from && date <= to;
  };

  const isRangeStart = (date: Date) =>
    selectedRange?.from && isSameDay(date, selectedRange.from);

  const isRangeEnd = (date: Date) =>
    selectedRange?.to && isSameDay(date, selectedRange.to);

  const handleDayClick = (date: Date) => {
    if (disabled) return;

    if (mode === 'single') {
      onSelect?.(isSameDay(date, selectedDate!) ? undefined : date);
    } else if (mode === 'range') {
      if (!rangeStart || (rangeStart && selectedRange?.to)) {
        setRangeStart(date);
        onSelect?.({ from: date, to: date });
      } else {
        const from = rangeStart < date ? rangeStart : date;
        const to = rangeStart < date ? date : rangeStart;
        setRangeStart(null);
        onSelect?.({ from, to });
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className={cn('p-3 select-none', className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={disabled}
        >
          <ChevronLeft />
        </button>
        <div className="text-sm font-medium">{formatMonthYear(currentMonth)}</div>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={disabled}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 text-center mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="w-9 h-9 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {days.map((date, i) => {
          const isOutside = date.getMonth() !== currentMonth.getMonth();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const inRange = isInRange(date);
          const isStart = isRangeStart(date);
          const isEnd = isRangeEnd(date);

          return (
            <button
              key={i}
              onClick={() => handleDayClick(date)}
              disabled={disabled || isOutside}
              className={cn(
                'relative h-9 w-9 text-sm rounded-md transition-colors',
                'flex items-center justify-center',
                'hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:z-10',
                // Disabled
                disabled && 'opacity-50 cursor-not-allowed',
                // Outside days
                isOutside && !showOutsideDays && 'invisible',
                isOutside && showOutsideDays && 'text-gray-400',
                // Today
                isToday && 'font-semibold text-primary',
                // Selected (single)
                isSelected && mode === 'single' && 'bg-primary text-white hover:bg-blue-700',
                // Range styles
                inRange && mode === 'range' && 'bg-blue-100',
                isStart && 'rounded-l-md bg-blue-600 text-white',
                isEnd && 'rounded-r-md bg-blue-600 text-white',
                (inRange && !isStart && !isEnd) && 'bg-blue-50'
              )}
            >
              {date.getDate()}
              {isStart && mode === 'range' && selectedRange?.to && (
                <div className="absolute inset-y-0 left-0 w-2 bg-blue-600 rounded-l-md" />
              )}
              {isEnd && mode === 'range' && (
                <div className="absolute inset-y-0 right-0 w-2 bg-blue-600 rounded-r-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Calendar.displayName = 'Calendar';