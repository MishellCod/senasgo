"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
// import { QuestionBubble } from "./question-bubble";
import { Mascot } from "./emblema";

import { AdBanner } from "./ad-banner";

type Props ={
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean;
  } | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();

  const router = useRouter();

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [
    correctAudio,
    _c,
    correctControls,
  ] = useAudio({ src: "/correct.wav" });
  const [
    incorrectAudio,
    _i,
    incorrectControls,
  ] = useAudio({ src: "/incorrect.wav" });
  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [streakMilestone, setStreakMilestone] = useState<number | null>(null);
  const [streakCelebrated, setStreakCelebrated] = useState(false);
  const [streakCount, setStreakCount] = useState<number | null>(null);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            if (response?.streakMilestone) {
              setStreakMilestone(response.streakMilestone);
            }
            if (response?.streakCelebrated) {
              setStreakCelebrated(true);
              setStreakCount(response.streak);
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."))
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."))
      });
    }
  };

  
if (!challenge) {
  return (
    <>
      {finishAudio}

      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={250}
        tweenDuration={8000}
        gravity={0.15}
      />

      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto px-6 text-center gap-y-6 overflow-hidden">

        {/* Mascota celebrando */}
        <div className="relative flex items-center justify-center animate-celebration-entry">
          {/* Fondo amarillo */}
          <div className="absolute w-40 h-40 rounded-full bg-yellow-100 animate-pulse" />

          {/* Mascota animada */}
          <video
            src="/celebracion.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Mascota de Senasgo celebrando"
            className="relative z-10 w-[280px] aspect-video object-contain"
          />

          {/* Destellos delante de la mascota */}
          <span className="absolute z-20 top-2 left-2 text-3xl pointer-events-none animate-celebration-sparkle">
            ✨
          </span>

          <span className="absolute z-20 top-0 right-2 text-2xl pointer-events-none animate-celebration-sparkle-delay">
            ⭐
          </span>

          <span className="absolute z-20 bottom-4 left-0 text-2xl pointer-events-none animate-celebration-sparkle">
            🌟
          </span>

          <span className="absolute z-20 bottom-2 right-0 text-3xl pointer-events-none animate-celebration-sparkle-delay">
            ✨
          </span>
        </div>
        
        {/* Mensaje de victoria */}
        <div className="space-y-2 animate-celebration-text">       
        {streakCelebrated ? (
          <>
            <div className="text-5xl animate-bounce">
              🔥
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-orange-500">
              ¡Racha de {streakCount ?? 1} {streakCount === 1 ? "día" : "días"}!
            </h1>

            <p className="text-neutral-500 text-lg">
              {streakMilestone === 3 && "¡Has alcanzado tus primeros 3 días de constancia!"}
              {streakMilestone === 7 && "¡Una semana aprendiendo lengua de señas!"}
              {streakMilestone === 15 && "¡15 días de esfuerzo y dedicación!"}
              {streakMilestone === 30 && "¡Un mes completo de aprendizaje!"}
              {streakMilestone === 100 && "¡100 días! Eres un ejemplo de constancia."}
              {!streakMilestone && "¡Excelente! Has completado un nuevo día de aprendizaje."}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-700">
              ¡Excelente trabajo!
            </h1>

            <p className="text-neutral-500 text-lg">
              Has completado esta lección.
            </p>
          </>
        )}
        </div>

        {/* Tarjeta especial de racha */}
        {streakMilestone && (
          <div className="w-full rounded-2xl border-2 border-orange-300 bg-orange-50 p-5 shadow-sm animate-celebration-rewards">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl animate-pulse">🔥</span>

              <div className="text-left">
                <p className="text-orange-600 font-extrabold text-2xl">
                  {streakMilestone} días
                </p>
                <p className="text-orange-500 font-semibold text-sm">
                  ¡Nueva meta de racha alcanzada!
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Recompensas */}
        <div className="flex items-center gap-4 w-full animate-celebration-rewards">

          <div className="flex-1 rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-4 shadow-sm">
            <div className="text-3xl animate-xp-pop">
              ⚡
            </div>

            <p className="text-2xl font-extrabold text-yellow-600">
              +{challenges.length * 10}
            </p>

            <p className="text-sm font-bold text-yellow-700">
              XP
            </p>
          </div>

          <div className="flex-1 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 shadow-sm">
            <div className="text-3xl">
              ❤️
            </div>

            <p className="text-2xl font-extrabold text-rose-500">
              {hearts}
            </p>

            <p className="text-sm font-bold text-rose-600">
              Vidas restantes
            </p>
          </div>

        </div>

        {/* Anuncio publicitario */}
        <AdBanner />

        {/* Mensaje motivador */}
        <p className="text-sm text-neutral-400 animate-celebration-text">
          ¡Cada lección te acerca a tu objetivo!
        </p>

      </div>

      <Footer
        lessonId={lessonId}
        status="completed"
        onCheck={() => router.push("/learn")}
      />
    </>
  );
}


  const title = challenge.type === "ASSIST" 
    ? "¿Qué texto o caracter ves ahí?"
    : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div
            key={activeIndex}
            className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >


            <h1 className="mt-4 text-lg lg:text-3xl text-center font-bold text-neutral-700">
              {title}
            </h1>
            {/*
            {challenge.type === "ASSIST" && (
              <QuestionBubble question={challenge.question} />
            )}
            */}
            <div>
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
                videoSrc={challenge.videoSrc}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
