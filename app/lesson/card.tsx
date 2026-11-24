
import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

import { cn } from "@/lib/utils";
import { challenges } from "@/db/schema";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  videoSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect["type"];
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  videoSrc,
  text,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: Props) => {
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const handleClick = useCallback(() => {
    if (disabled) return;

    controls.play();
    onClick();
  }, [disabled, onClick, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div className="relative h-full">
      <div
        onClick={handleClick}
        className={cn(
          "h-full border-2 rounded-xl border-b-4 p-4 lg:p-6 cursor-pointer transform-gpu transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md active:translate-y-0 active:scale-[0.98] active:border-b-2",
          selected && "border-sky-300 bg-sky-100 hover:bg-sky-100",
          selected &&
            status === "correct" &&
            "border-green-300 bg-green-100 hover:bg-green-100 animate-correct",
          selected &&
            status === "wrong" &&
            "border-rose-300 bg-rose-100 hover:bg-rose-100 animate-wrong",
          disabled && "pointer-events-none hover:bg-white",
          type === "ASSIST" && "lg:p-3 w-full"
        )}
      >
        {audio}

        {videoSrc ? (
          <div className="mb-4 w-full overflow-hidden rounded-xl bg-black">
            <video
              src={videoSrc}
              controls
              playsInline
              preload="metadata"
              className="w-full h-[260px] lg:h-[150px] object-contain rounded-xl"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        ) : (
          imageSrc && (
            <div className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full">
              <Image src={imageSrc} fill alt={text} />
            </div>
          )
        )}

        <div
          className={cn(
            "flex items-center justify-center",
            type === "ASSIST" && "flex-row-reverse"
          )}
        >
          {type === "ASSIST" && <div />}

          <p
            className={cn(
              "text-neutral-600 text-sm lg:text-base",
              selected && "text-sky-500",
              selected && status === "correct" && "text-green-500",
              selected && status === "wrong" && "text-rose-500"
            )}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
