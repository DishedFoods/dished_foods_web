"use client";

import { useEffect } from "react";
import { CheckCircleIcon } from "@/components/ui/Icons";

interface Props {
  msg: string;
  onDone: () => void;
}

export function Toast({ msg, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-7 right-7 z-[9999] bg-gray-900 text-white
                    px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold
                    flex items-center gap-3 animate-slide-up max-w-xs">
      <span className="text-green-400 flex-shrink-0">
        <CheckCircleIcon size={20} />
      </span>
      {msg}
    </div>
  );
}
