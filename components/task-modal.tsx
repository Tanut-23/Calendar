'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { X, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  person: 'nut' | 'nice' | 'both';
  date: string;
}

interface TaskModalProps {
  date: Date;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskModal({ date, tasks, isOpen, onClose, onAddTask, onDeleteTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [person, setPerson] = useState<'nut' | 'nice' | 'both'>('nut');

  const togglePerson = (p: 'nut' | 'nice') => {
    if (person === p) {
      // Prevent deselecting the only person (optional, valid choice for UX)
      return;
    }
    if (person === 'both') {
      setPerson(p === 'nut' ? 'nice' : 'nut');
    } else {
      setPerson('both');
    }
  };

  const handleAddTask = () => {
    if (title.trim()) {
      onAddTask({
        title,
        description,
        time,
        person,
        date: format(date, 'yyyy-MM-dd'),
      });
      setTitle('');
      setDescription('');
      setTime('');
      setPerson('nut');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-3 md:zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#E8D5CC] bg-white rounded-t-3xl md:rounded-t-3xl">
          <h2 className="text-xl font-bold text-[#4A4A4A]">
            {format(date, 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFF8F0] rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-[#4A4A4A]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add Task Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#4A4A4A]">Add New Activity</h3>

            <input
              type="text"
              placeholder="Activity name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-2 border-[#E8D5CC] focus:outline-none focus:border-blue-200 transition-colors placeholder-[#AAAAAA]"
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-2 border-[#E8D5CC] focus:outline-none focus:border-blue-200 transition-colors placeholder-[#AAAAAA]"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-2 border-[#E8D5CC] focus:outline-none focus:border-blue-200 transition-colors"
            />

            {/* Person selector */}
            <div className="flex gap-3">
              {(['nut', 'nice'] as const).map(p => {
                const isSelected = person === p || person === 'both';
                return (
                  <button
                    key={p}
                    onClick={() => togglePerson(p)}
                    className={`
                      flex-1 py-3 px-4 rounded-2xl font-semibold transition-all
                      ${isSelected
                        ? p === 'nut'
                          ? 'bg-blue-200 text-foreground'
                          : 'bg-pink-200 text-foreground'
                        : 'bg-[#FFF8F0] text-[#4A4A4A] border-2 border-[#E8D5CC]'
                      }
                    `}
                  >
                    {p === 'nut' ? '💙 Nut' : '🩷 Nice'}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleAddTask}
              className={`
                w-full py-3 rounded-2xl font-semibold transition-all
                ${person === 'nut'
                  ? 'bg-blue-200 hover:bg-blue-300 text-foreground'
                  : person === 'nice'
                    ? 'bg-pink-200 hover:bg-pink-300 text-foreground'
                    : 'bg-gradient-to-r from-blue-200/70 via-purple-200/60 to-pink-200/70 text-foreground hover:opacity-90'
                }
              `}
            >
              <Heart className="inline-block h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {/* Tasks list */}
          <div className="space-y-3 border-t border-[#E8D5CC] pt-4">
            <h3 className="font-semibold text-[#4A4A4A]">Activities Today</h3>
            {tasks.length > 0 ? (
              <div className="space-y-3 animate-in fade-in duration-300">
                {tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={`
                      p-4 rounded-2xl flex items-start justify-between
                      transition-all duration-300 hover:shadow-md
                      ${task.person === 'nut'
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : task.person === 'nice'
                          ? 'bg-pink-50 hover:bg-pink-100'
                          : 'bg-gradient-to-r from-blue-200/70 via-purple-200/60 to-pink-200/70 text-foreground hover:opacity-90'
                      }
                      animate-in slide-in-from-left-4 duration-500`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-[#4A4A4A]">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-[#666666]">{task.description}</div>
                      )}
                      {task.time && (
                        <div className="text-sm text-[#888888]">⏰ {task.time}</div>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 ml-2 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4 text-[#888888]" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#AAAAAA]">
                <p className="text-sm">No activities yet for this day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
