
import { Megaphone } from "lucide-react";

export const AdBanner = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <Megaphone className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Publicidad
          </span>
        </div>

        <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-semibold text-neutral-500">
          Patrocinado
        </span>
      </div>

      {/* Contenido del anuncio */}
      <div className="flex min-h-[115px] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-5 text-center">
        <div className="max-w-xs">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <Megaphone className="h-5 w-5 text-blue-500" />
          </div>

          <p className="text-sm font-extrabold text-neutral-700">
            Espacio publicitario de Senasgo
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            Aquí aparecerán anuncios de nuestros anunciantes.
          </p>
        </div>
      </div>
    </div>
  );
};
