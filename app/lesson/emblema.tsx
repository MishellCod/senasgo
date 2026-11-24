
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  status: "correct" | "wrong" | "none";
};

export const Mascot = ({ status }: Props) => {
  return (
    <div className="relative flex items-center justify-center w-[120px] h-[140px] shrink-0">

      {/* Destellos al acertar */}
      {status === "correct" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mascot-sparkle sparkle-1">✨</span>
          <span className="mascot-sparkle sparkle-2">⭐</span>
          <span className="mascot-sparkle sparkle-3">✨</span>
          <span className="mascot-sparkle sparkle-4">⭐</span>
        </div>
      )}

      {/* Mascota */}
      <Image
        src="/emblema0.svg"
        alt="Mascota de Senasgo"
        width={110}
        height={110}
        priority
        className={cn(
          "relative z-10 object-contain",
          status === "none" && "animate-mascot-float",
          status === "correct" && "animate-mascot-celebrate",
          status === "wrong" && "animate-mascot-shake"
        )}
      />
    </div>
  );
};
