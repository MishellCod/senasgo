import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);

  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer
      className={cn(
        "h-[100px] lg:h-[140px] border-t-2 transition-colors duration-300",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100",
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Bien hecho!
          </div>
        )}

        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Try again.
          </div>
        )}

        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
          >
            Practice again
          </Button>
        )}

        <Button
          disabled={disabled}
          className={cn(
            "ml-auto transition-all duration-200 ease-out",
            "hover:scale-[1.03] hover:shadow-md",
            "active:scale-[0.97]",
            status !== "none" &&
              status !== "completed" &&
              "animate-in fade-in slide-in-from-bottom-2 duration-300",
          )}
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Retry"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};