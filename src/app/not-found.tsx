import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="text-9xl mb-4 opacity-50 relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-32 h-32 mx-auto text-pokered">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"/>
          <path d="M2 12h10M22 12h-10"/>
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-800 mb-4 tracking-tight">
        404 - Pokémon Not Found
      </h1>
      <p className="text-slate-500 mb-8 max-w-md text-lg">
        Oops! The Pokémon or page you are looking for seems to have used Teleport and escaped our Pokédex.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-pokered text-white rounded-full font-bold tracking-wide shadow-md hover:bg-red-600 transition-colors shadow-pokered/30 hover:-translate-y-0.5"
      >
        Return to Safety
      </Link>
    </main>
  );
}
