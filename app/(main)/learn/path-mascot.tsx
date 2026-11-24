
"use client";

import { useEffect, useState } from "react";

type Props = {
  activeLessonId?: number;
};

export const PathMascot = ({ activeLessonId }: Props) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const [isWalking, setIsWalking] = useState(false);


  useEffect(() => {
    if (!activeLessonId) return;

    const lastLessonId = sessionStorage.getItem(
    "senasgo-last-active-lesson"
    );

    const shouldWalk =
    lastLessonId !== null &&
    lastLessonId !== String(activeLessonId);

    const updatePosition = () => {
      const container = document.getElementById("lesson-path");

      const lesson = container?.querySelector(
        `[data-lesson-id="${activeLessonId}"]`
      );

      if (!container || !lesson) return;

      const containerRect = container.getBoundingClientRect();
      const lessonRect = lesson.getBoundingClientRect();

      const mascotWidth = 285;
      const mascotHeight = 275;

      let x = lessonRect.right - containerRect.left + 12;

      const y =
        lessonRect.top -
        containerRect.top +
        (lessonRect.height - mascotHeight) / 2;

      x = Math.max(
        0,
        Math.min(x, containerRect.width - mascotWidth)
      );

      setPosition({
        x,
        y,
        visible: true,
      });
    };

    if (shouldWalk) {
      setIsWalking(true);
    }

    const activeLessonElement = document
    .getElementById("lesson-path")
    ?.querySelector(
        `[data-lesson-id="${activeLessonId}"]`
    );

    activeLessonElement?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
    });

    const frame = requestAnimationFrame(updatePosition);

    const walkingTimeout = shouldWalk
    ? window.setTimeout(() => {
        setIsWalking(false);
        sessionStorage.setItem(
            "senasgo-last-active-lesson",
            String(activeLessonId)
        );
        }, 8200)
    : undefined;

    if (!shouldWalk) {
    sessionStorage.setItem(
        "senasgo-last-active-lesson",
        String(activeLessonId)
    );
    }

    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);

      if (walkingTimeout) {
        window.clearTimeout(walkingTimeout);
      }
    };
  }, [activeLessonId]);

  if (!activeLessonId) return null;

  return (
    <div
    className="absolute z-20 pointer-events-none transition-all ease-in-out"
      style={{
        left: position.x,
        top: position.y,
        width: 285,
        height: 275,
        opacity: position.visible ? 1 : 0,
        transitionDuration: isWalking ? "8200ms" : "700ms",
      }}
    >
      <video
        key={isWalking ? "walking" : "resting"}
        src={isWalking ? "/camino.webm" : "/reposos.webm"}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
