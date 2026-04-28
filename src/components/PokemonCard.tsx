'use client';

import Image from 'next/image';
import Link from 'next/link';
import { extractIdFromUrl, getPokemonImageUrl } from '@/lib/api';
import { PokemonWithDetails } from '@/components/HomeClient';

interface PokemonCardProps {
  pokemon: PokemonWithDetails;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonWithDetails) => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705898',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }: PokemonCardProps) {
  const id = extractIdFromUrl(pokemon.url);
  const imageUrl = getPokemonImageUrl(id);
  
  // Use pre-fetched details from batch request
  const details = pokemon.details;

  const primaryType = details?.types[0]?.type.name || 'normal';
  const typeColor = TYPE_COLORS[primaryType] || '#A8A77A';

  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 border border-slate-50 w-full aspect-[3/4] flex flex-col justify-between p-6">
      
      {/* Abstract Shape Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-500"
        style={{ color: typeColor }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-[180%] h-[180%] top-[-20%] left-[-40%] transform -rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out">
          <path fill="currentColor" d="M45.7,-76.1C58.9,-69.3,69.1,-55.4,76.5,-40.4C83.9,-25.4,88.5,-9.3,86.8,6.2C85.1,21.7,77.1,36.6,66.3,48.5C55.5,60.4,41.9,69.3,26.7,75.1C11.5,80.9,-5.3,83.6,-21.4,79.9C-37.5,76.2,-52.9,66.1,-63.9,53.2C-74.9,40.3,-81.5,24.6,-83.4,8.5C-85.3,-7.6,-82.5,-24.1,-74.2,-37.7C-65.9,-51.3,-52.1,-62,-37.8,-68.4C-23.5,-74.8,-8.7,-76.9,6.7,-79C22.1,-81.1,44.2,-83.2,45.7,-76.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Top Header Row */}
      <div className="relative z-10 flex justify-between items-start w-full">
        {/* ID with Pokeball */}
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm tracking-widest">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-800">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"/>
            <path d="M2 12h10M22 12h-10"/>
          </svg>
          {id.padStart(4, '0')}
        </div>

        {/* Type Badges */}
        <div className="flex flex-col gap-1.5 items-end">
          {details?.types.map((t) => (
            <div 
              key={t.type.name}
              className="px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm uppercase tracking-wider backdrop-blur-sm"
              style={{ backgroundColor: TYPE_COLORS[t.type.name] || '#A8A77A' }}
            >
              {t.type.name}
            </div>
          ))}
        </div>
      </div>

      {/* Clickable Area for Image and Name */}
      <Link href={`/pokemon/${pokemon.name}`} className="relative z-10 flex-1 flex flex-col items-center justify-center outline-none mt-4 group">
        <div className="relative w-full h-44 drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 origin-bottom">
          <Image
            src={imageUrl}
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={parseInt(id) <= 20}
          />
        </div>
      </Link>

      {/* Bottom Footer Row */}
      <div className="relative z-10 w-full mt-4 flex justify-between items-end">
        <div className="flex flex-col">
          {/* Subtitle / Species placeholder */}
          <span className="text-xs text-slate-400 font-medium capitalize mb-0.5 opacity-80">
            {primaryType} Type Pokémon
          </span>
          <h2 className="text-2xl font-black font-outfit capitalize text-slate-800 tracking-tight leading-none group-hover:text-pokered transition-colors duration-300">
            {pokemon.name}
          </h2>
        </div>

        {/* Favorite Button (positioned at bottom right to replace Japanese text visually) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(pokemon);
          }}
          className="p-2 -mr-2 -mb-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Toggle Favorite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'var(--color-pokered)' : 'none'}
            stroke={isFavorite ? 'var(--color-pokered)' : '#94a3b8'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isFavorite ? 'scale-110 text-pokered' : 'scale-100'}`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
