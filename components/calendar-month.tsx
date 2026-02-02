'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './calendar-day';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  person: 'nut' | 'nice' | 'both';
  date: string;
}

interface CalendarMonthProps {
  tasks: Task[];
  onDayClick: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarMonth({ tasks, onDayClick, currentMonth, onMonthChange }: CalendarMonthProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get days from previous month to fill the grid
  const firstDayOfWeek = monthStart.getDay();
  const previousMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) =>
    new Date(monthStart.getFullYear(), monthStart.getMonth(), -i)
  ).reverse();

  const allDays = [...previousMonthDays, ...monthDays];

  // Pad the end if needed to complete the grid
  const remainingDays = 42 - allDays.length;
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) =>
    new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, i + 1)
  );

  const calendarDays = [...allDays, ...nextMonthDays];

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.date === dateStr);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-[#4A4A4A] text-center sm:text-left">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2 sm:mb-3">
        {WEEKDAY_LABELS.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-[#888888]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {calendarDays.map((date, index) => (
          <CalendarDay
            key={index}
            date={date}
            tasks={getTasksForDate(date)}
            onDayClick={onDayClick}
            isCurrentMonth={isSameMonth(date, currentMonth)}
          />
        ))}
      </div>
    </div>
  );
}
