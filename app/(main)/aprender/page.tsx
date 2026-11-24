
import { VideoLibrary } from "@/components/video-library";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aprender",
  description: "Explora videos educativos de lengua de señas.",
};

const AprenderPage = () => {
  return (
    <div className="h-full max-w-[1100px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-700">
          Aprende con videos
        </h1>

        <p className="text-neutral-500 mt-2">
          Explora nuestros contenidos y aprende a tu propio ritmo.
        </p>
      </div>

      <VideoLibrary />
    </div>
  );
};

export default AprenderPage;
