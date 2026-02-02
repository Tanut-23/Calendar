'use client';

import { useState, useEffect } from 'react';
import { Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarMonth } from '@/components/calendar-month';
import { TaskModal } from '@/components/task-modal';
import { TooltipProvider } from '@/components/ui/tooltip';

interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  person: 'nut' | 'nice' | 'both';
  date: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const selectedTasks = selectedDate
    ? tasks.filter(
      t => t.date === format(selectedDate, 'yyyy-MM-dd')
    )
    : [];

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0] to-[#F5EFEB]">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/90 border-b border-[#E8D5CC] shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-center gap-3 animate-in fade-in duration-700">
              <div className="p-2 bg-gradient-to-br from-blue-200 to-pink-200 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Heart className="h-6 w-6 text-white animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent">
                Calendar
              </h1>
            </div>
            <p className="text-center text-[#888888] text-sm mt-2 animate-in fade-in duration-700 delay-100">
              Plan our days together
            </p>
          </div>
        </header>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-700 delay-200">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 hover:shadow-3xl transition-shadow duration-300 min-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="inline-block animate-spin">
                    <div className="h-8 w-8 border-4 border-blue-200 border-t-pink-200 rounded-full" />
                  </div>
                  <p className="mt-4 text-[#888888]">Loading your calendar...</p>
                </div>
              </div>
            ) : (
              <CalendarMonth
                tasks={tasks}
                onDayClick={handleDayClick}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-700 delay-300">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default">
              <div className="w-3 h-3 rounded-full bg-blue-200 shadow-lg" />
              <div>
                <div className="font-semibold text-[#4A4A4A]">Nut</div>
                <div className="text-sm text-[#888888]">Pastel Blue</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default">
              <div className="w-3 h-3 rounded-full bg-pink-200 shadow-lg" />
              <div>
                <div className="font-semibold text-[#4A4A4A]">Nice</div>
                <div className="text-sm text-[#888888]">Pastel Pink</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-[#E8D5CC] text-center text-[#888888] text-sm animate-in fade-in duration-700 delay-300">
          <p>Made with 💕 for couples who plan together</p>
        </footer>

        {/* Task Modal */}
        <TaskModal
          date={selectedDate || new Date()}
          tasks={selectedTasks}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </TooltipProvider>
  );
}
