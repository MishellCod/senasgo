
"use server";

import { auth } from "@clerk/nextjs";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

const STREAK_MILESTONES = [3, 7, 15, 30, 100];

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;

  const existingChallengeProgress =
    await db.query.challengeProgress.findFirst({
      where: and(
        eq(challengeProgress.userId, userId),
        eq(challengeProgress.challengeId, challengeId),
      ),
    });

  const isPractice = !!existingChallengeProgress;
  const wasAlreadyCompleted = existingChallengeProgress?.completed === true;

  if (
    currentUserProgress.hearts === 0 &&
    !isPractice &&
    !userSubscription?.isActive
  ) {
    return { error: "hearts" };
  }

  if (isPractice) {
    await db.update(challengeProgress)
      .set({ completed: true })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    await db.update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5),
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));
  } else {
    await db.insert(challengeProgress).values({
      challengeId,
      userId,
      completed: true,
    });

    await db.update(userProgress)
      .set({
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));
  }

  const lessonChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId),
    columns: {
      id: true,
    },
  });

  const completedProgress = await db.query.challengeProgress.findMany({
    where: and(
      eq(challengeProgress.userId, userId),
      inArray(
        challengeProgress.challengeId,
        lessonChallenges.map((item) => item.id),
      ),
    ),
  });

  const isLessonCompleted =
    lessonChallenges.length > 0 &&
    lessonChallenges.every((item) =>
      completedProgress.some(
        (progress) =>
          progress.challengeId === item.id &&
          progress.completed,
      ),
    );
  
  let updatedStreak = currentUserProgress.streak;
  let streakMilestone: number | null = null;
  let streakCelebrated = false;

  if (isLessonCompleted && !wasAlreadyCompleted) {
    const todayParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = todayParts.find((part) => part.type === "year")!.value;
    const month = todayParts.find((part) => part.type === "month")!.value;
    const day = todayParts.find((part) => part.type === "day")!.value;

    const today = `${year}-${month}-${day}`;
    const lastDate = currentUserProgress.lastActiveDate;

    if (lastDate !== today) {
      let nextStreak = 1;

      if (lastDate) {
        const todayTime = Date.parse(`${today}T00:00:00Z`);
        const lastTime = Date.parse(`${lastDate}T00:00:00Z`);

        const difference = Math.round(
          (todayTime - lastTime) / 86_400_000,
        );

        nextStreak =
          difference === 1
            ? currentUserProgress.streak + 1
            : 1;
      }

      updatedStreak = nextStreak;
      streakCelebrated = true;

      if (STREAK_MILESTONES.includes(nextStreak)) {
        streakMilestone = nextStreak;
      }

      await db.update(userProgress)
        .set({
          streak: nextStreak,
          longestStreak: Math.max(
            currentUserProgress.longestStreak,
            nextStreak,
          ),
          lastActiveDate: today,
        })
        .where(eq(userProgress.userId, userId));
    }
  }


  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);

  return {
  streak: updatedStreak,
  streakMilestone,
  streakCelebrated,
  };
};
