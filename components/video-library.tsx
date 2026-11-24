
"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { videoCategories } from "@/lib/videos";

export const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    videoCategories[0].id
  );

  const [selectedVideoId, setSelectedVideoId] = useState<
    string | number | null
  >(
    videoCategories[0].id
  );

  // Obtener la categoría seleccionada
  const currentCategory = videoCategories.find(
    (category) => category.id === selectedCategory
  );

  // Obtener los videos de la categoría seleccionada
  const currentVideos = currentCategory
    ? currentCategory.videos ??
      (currentCategory.videoSrc
        ? [
            {
              id: currentCategory.id,
              title: currentCategory.title,
              description: currentCategory.description ?? "",
              videoSrc: currentCategory.videoSrc,
            },
          ]
        : [])
    : [];

  // Obtener el video seleccionado
  const selectedVideo = currentVideos.find(
    (video) => video.id === selectedVideoId
  );

  // Cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    const category = videoCategories.find(
      (item) => item.id === categoryId
    );

    const firstVideo = category?.videos?.[0];

    setSelectedVideoId(
      firstVideo?.id ?? category?.id ?? null
    );
  };

  return (
    <div className="w-full space-y-8">

      {/* CATEGORÍAS */}
      <div className="flex flex-wrap gap-3">
        {videoCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`rounded-xl px-5 py-3 font-semibold transition ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* LISTA DE TEMAS: PALABRAS Y FRASES */}
      {currentCategory?.videos && (
        <div className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-neutral-700">
              Temas de {currentCategory.title.toLowerCase()}
            </h2>

            <p className="text-sm text-neutral-500 mt-1">
              Selecciona el tema que deseas aprender.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  selectedVideoId === video.id
                    ? "border-sky-400 bg-sky-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-sky-200 hover:bg-sky-50/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">

                  <div>
                    <h3 className="font-bold text-neutral-700">
                      {video.title}
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1">
                      {video.description}
                    </p>
                  </div>

                  <PlayCircle
                    size={24}
                    className="shrink-0 text-sky-600"
                  />

                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* REPRODUCTOR */}
      {selectedVideo ? (
        <div className="w-full space-y-4 pb-8">

          <div className="w-full max-w-xl mx-auto p-1 rounded-3xl bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 shadow-xl shadow-sky-200/60">

            <div className="rounded-[22px] bg-white p-2">

              <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-200">

                <video
                  key={selectedVideo.id}
                  src={selectedVideo.videoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video object-contain"
                />

              </div>

            </div>

            {/* INFORMACIÓN DEL VIDEO */}
            <div className="max-w-xl mx-auto px-2 mt-4 mb-4">

              <h2 className="text-xl font-bold text-neutral-700">
                {selectedVideo.title}
              </h2>

              {selectedVideo.description && (
                <p className="text-neutral-500 mt-2">
                  {selectedVideo.description}
                </p>
              )}

            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-neutral-100 p-8 text-center">
          <p className="text-neutral-500">
            Todavía no hay videos en esta categoría.
          </p>
        </div>
      )}

    </div>
  );
};
