'use client';

import PokemonCard from '@/components/PokemonCard';
import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { getPokemonDetails, extractIdFromUrl } from '@/lib/api';
import { PokemonWithDetails } from '@/components/HomeClient';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isLoaded } = useFavorites();

  const favoriteQueries = useQueries({
    queries: favorites.map((pokemon) => {
      const id = extractIdFromUrl(pokemon.url);
      return {
        queryKey: ['pokemonDetails', id],
        queryFn: () => getPokemonDetails(id),
        staleTime: Infinity,
      };
    }),
  });

  const isLoading = favoriteQueries.some((q) => q.isLoading);

  const readyFavorites = favorites
    .map((pokemon, index) => ({
      ...pokemon,
      details: favoriteQueries[index].data,
    }))
    .filter((p) => p.details) as PokemonWithDetails[];

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-outfit text-center mb-4 tracking-tight">
          Your <span className="text-pokered">Favorite</span> Pokémon
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl">
          A collection of all the Pokémon you have saved for quick access.
        </p>
      </div>

      {!isLoaded || isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-pokered animate-spin"></div>
        </div>
      ) : readyFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {readyFavorites.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              pokemon={pokemon} 
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-outfit mb-4">No favorites yet!</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            You haven't added any Pokémon to your favorites list.
          </p>
          <Link href="/" className="px-8 py-3 bg-pokered text-white font-bold rounded-full hover:bg-red-600 transition-colors shadow-lg hover:shadow-red-500/30">
            Explore Pokémon
          </Link>
        </div>
      )}
    </main>
  );
}
