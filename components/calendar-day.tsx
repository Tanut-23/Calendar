'use client';

import { format, isToday } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Task {
  id: string;
  title: string;
  description?: string;
  person: 'nut' | 'nice' | 'both';
}

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
  isCurrentMonth: boolean;
}

export function CalendarDay({ date, tasks, onDayClick, isCurrentMonth }: CalendarDayProps) {
  const dayNumber = format(date, 'd');
  const hasNutTask = tasks.some(t => t.person === 'nut' || t.person === 'both');
  const hasNiceTask = tasks.some(t => t.person === 'nice' || t.person === 'both');
  const isCurrentDay = isToday(date);

  return (
    <button
      onClick={() => onDayClick(date)}
      className={`
        relative w-full aspect-square sm:min-h-24 md:min-h-28 rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col justify-between
        transition-all duration-300 hover:shadow-lg hover:scale-102 active:scale-95 group
        ${isCurrentMonth ? 'bg-white border-2 border-[#E8D5CC] hover:border-blue-200 hover:bg-[#FFF8F0]' : 'bg-[#FFF8F0] text-[#AAAAAA]'}
        ${isCurrentDay ? 'ring-2 ring-blue-200 ring-offset-2 bg-gradient-to-br from-white to-[#F5EFEB]' : ''}
      `}
    >
      <div className="text-right">
        <span className={`
          text-xs sm:text-sm font-semibold
          ${isCurrentMonth ? 'text-[#4A4A4A]' : 'text-[#AAAAAA]'}
          ${isCurrentDay ? 'text-blue-200' : ''}
        `}>
          {dayNumber}
        </span>
      </div>

      {/* Task indicators */}
      <div className="flex gap-1 justify-center">
        {hasNutTask && (
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-200" aria-label="Nut has task" />
        )}
        {hasNiceTask && (
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-200" aria-label="Nice has task" />
        )}
      </div>

      {/* Quick task preview - hidden on small screens */}
      <div className="hidden sm:flex flex-col gap-1">
        {tasks.slice(0, 2).map(task => (
          <Tooltip key={task.id}>
            <TooltipTrigger asChild>
              <div
                className={`
                  text-xs px-2 py-1 rounded-full font-medium truncate w-full text-left
                  ${task.person === 'nut'
                    ? 'bg-blue-200 text-foreground'
                    : task.person === 'nice'
                      ? 'bg-pink-200 text-foreground'
                      : 'bg-gradient-to-r from-blue-200/70 via-purple-200/60 to-pink-200/70 text-foreground'
                  }
                `}
              >
                {task.title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{task.title}</p>
              {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
            </TooltipContent>
          </Tooltip>
        ))}
        {tasks.length > 2 && (
          <div className="text-xs text-[#888888] px-2 text-center">
            +{tasks.length - 2} more
          </div>
        )}
      </div>
    </button>
  );
}
