import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Explora videos educativos de lengua de señas.",
};

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [
    courses,
    userProgress,
  ] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  console.log("CURSOS:", courses);
console.log("PROGRESO:", userProgress);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">
        Cursos de Señas
      </h1>
      <List
        courses={courses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  );
};

export default CoursesPage;
