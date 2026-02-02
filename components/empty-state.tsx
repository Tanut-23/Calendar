'use client';

import { Cloud, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-4 bg-gradient-to-br from-[#A7C7E7]/20 to-[#F4B6C2]/20 rounded-full">
        <Sparkles className="h-8 w-8 text-[#A7C7E7] animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
        No activities planned yet
      </h3>
      <p className="text-sm text-[#888888] max-w-xs">
        Click on a day to create your first activity together
      </p>
    </div>
  );
}
