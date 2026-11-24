import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/letra.svg" 
            alt="Letras" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Letras
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/numero.svg" 
            alt="Numeros" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Numeros
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/palabra.svg" 
            alt="Palabras" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Palabras
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image 
            src="/frase.svg" 
            alt="Frases" 
            height={32} 
            width={40}
            className="mr-4 rounded-md"
          />
          Frases
        </Button>
      </div>
    </footer>
  );
};
