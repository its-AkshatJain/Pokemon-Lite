'use client';

import { useState, useEffect } from 'react';
import { PokemonListItem } from '@/lib/api';

export function useFavorites() {
  const [favorites, setFavorites] = useState<PokemonListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pokedex-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (pokemon: PokemonListItem) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.name === pokemon.name);
      let updated;
      if (exists) {
        updated = prev.filter((p) => p.name !== pokemon.name);
      } else {
        updated = [...prev, pokemon];
      }
      localStorage.setItem('pokedex-favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (name: string) => {
    return favorites.some((p) => p.name === name);
  };

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
