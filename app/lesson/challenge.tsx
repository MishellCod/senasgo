
import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";

import { Card } from "./card";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: typeof challenges.$inferSelect["type"];
  videoSrc: string | null;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  videoSrc,
}: Props) => {
  const showAnimation =
    selectedOption !== undefined &&
    (status === "correct" || status === "wrong");

  const animationSrc =
    status === "correct" ? "/correcto.webm" : "/incorrecto.webm";

  return (
    <div className="flex flex-col gap-y-6 w-full">

      {/* Video principal y animación original de ASSIST */}
      {videoSrc && (
        <div className="relative flex items-center justify-center w-full">
          <div className="w-full min-w-0 max-w-[400px]">
            <div className="w-full overflow-hidden rounded-2xl bg-black">
              <video
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-video object-contain"
              />
            </div>
          </div>

          {/* ASSIST: conserva la posición original */}
          {type === "ASSIST" && showAnimation && (
            <video
              key={`${selectedOption}-${status}`}
              src={animationSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="hidden 2xl:block absolute left-[calc(50%+200px)] top-[-30px] w-74 h-64 object-contain pointer-events-none z-20 bg-white rounded-xl"
            />
          )}
        </div>
      )}

      {/* Opciones de respuesta */}
      <div
        className={cn(
          "grid gap-2",
          type === "ASSIST" && "grid-cols-1",
          type === "SELECT" &&
            "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
        )}
      >
        {options.map((option, i) => (
          <div
            key={option.id}
            className={cn(
              "animate-in fade-in slide-in-from-bottom-2 duration-300",
              i === 1 && "delay-100",
              i === 2 && "delay-200",
              i === 3 && "delay-300"
            )}
          >
            <Card
              id={option.id}
              text={option.text}
              imageSrc={option.imageSrc}
              videoSrc={option.videoSrc}
              shortcut={`${i + 1}`}
              selected={selectedOption === option.id}
              onClick={() => onSelect(option.id)}
              status={status}
              audioSrc={option.audioSrc}
              disabled={disabled}
              type={type}
            />
          </div>
        ))}
      </div>

      {/* SELECT: animación fija al lado derecho de la pantalla */}
      {type === "SELECT" && showAnimation && (
        <video
          key={`${selectedOption}-${status}`}
          src={animationSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="fixed right-20 top-1/2 -translate-y-1/2 w-96 h-96  object-contain pointer-events-none z-50 bg-white rounded-xl"
        />
      )}
    </div>
  );
};
