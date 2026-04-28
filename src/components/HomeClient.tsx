'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getPokemonList, getPokemonTypes, getPokemonByType, PokemonListItem, getPokemonDetails, PokemonDetails, extractIdFromUrl } from '@/lib/api';
import PokemonCard from '@/components/PokemonCard';
import { useFavorites } from '@/hooks/useFavorites';
import { ChevronDown, Search } from 'lucide-react';

const LIMIT = 24;

export interface PokemonWithDetails extends PokemonListItem {
  details: PokemonDetails;
}

// Premium Custom Dropdown Component
function TypeSelect({ 
  types, 
  selected, 
  onChange 
}: { 
  types: {name: string}[]; 
  selected: string; 
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative md:w-48 z-20" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-slate-100 rounded-full focus:outline-none hover:border-slate-200 transition-all shadow-sm text-slate-800 capitalize font-medium"
      >
        <span>{selected || "All Types"}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200 origin-top">
          <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar flex flex-col gap-0.5">
            <button
              onClick={() => { onChange(""); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors ${selected === "" ? "bg-pokered text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              All Types
            </button>
            {types.map(type => (
              <button
                key={type.name}
                onClick={() => { onChange(type.name); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors capitalize ${selected === type.name ? "bg-pokered text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeClient() {
  const [pokemonList, setPokemonList] = useState<PokemonWithDetails[]>([]);
  const [types, setTypes] = useState<{name: string, url: string}[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // For client side pagination of filtered types
  const [typeFilteredCache, setTypeFilteredCache] = useState<PokemonListItem[]>([]);
  
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { isFavorite, toggleFavorite, isLoaded: favsLoaded } = useFavorites();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Fetch Types
  useEffect(() => {
    getPokemonTypes().then(setTypes).catch(console.error);
  }, []);

  // Fetch List based on Type or Pagination
  const fetchPokemon = useCallback(async (currentPage: number, reset = false, currentSelectedType = selectedType) => {
    try {
      setIsLoading(true);
      
      let listToProcess: PokemonListItem[] = [];
      let nextHasMore = false;

      if (currentSelectedType) {
        let allOfType = typeFilteredCache;
        // If resetting, fetch the full list for this type
        if (reset) {
          allOfType = await getPokemonByType(currentSelectedType);
          setTypeFilteredCache(allOfType);
        }
        
        // Client-side pagination slice
        listToProcess = allOfType.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);
        nextHasMore = allOfType.length > (currentPage + 1) * LIMIT;
        
      } else {
        const data = await getPokemonList(LIMIT, currentPage * LIMIT);
        listToProcess = data.results;
        nextHasMore = !!data.next;
      }

      // Batch Fetch Details
      const detailedList = await Promise.all(
        listToProcess.map(async (pokemon) => {
          const id = extractIdFromUrl(pokemon.url);
          const details = await getPokemonDetails(id);
          return { ...pokemon, details };
        })
      );

      setPokemonList(prev => reset ? detailedList : [...prev, ...detailedList]);
      setHasMore(nextHasMore);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, typeFilteredCache]);

  // Effect to refetch when Type changes
  useEffect(() => {
    setPage(0);
    // Passing selectedType explicitly to avoid dependency closure issues on fast clicks
    fetchPokemon(0, true, selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]); // Intentional: only trigger on selectedType change

  // Effect to fetch more on page change
  useEffect(() => {
    if (page > 0) {
      fetchPokemon(page, false, selectedType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Intentional: only trigger on page change

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredList = useMemo(() => {
    if (!searchQuery) return pokemonList;
    return pokemonList.filter(p => p.name.includes(searchQuery));
  }, [pokemonList, searchQuery]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 relative z-20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Pokémon by name..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-100 rounded-full focus:outline-none hover:border-slate-200 focus:border-slate-300 transition-all shadow-sm text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        <TypeSelect 
          types={types} 
          selected={selectedType} 
          onChange={setSelectedType} 
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
        {filteredList.map((pokemon) => (
          <PokemonCard 
            key={pokemon.name} 
            pokemon={pokemon} 
            isFavorite={favsLoaded ? isFavorite(pokemon.name) : false}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* Loading / Pagination */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-pokered animate-spin"></div>
        </div>
      )}

      {!isLoading && filteredList.length === 0 && (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-2xl font-bold font-outfit mb-2 text-slate-700">No Pokémon found!</h3>
          <p>Try a different search or filter.</p>
        </div>
      )}

      {hasMore && !isLoading && !searchQuery && (
        <div ref={lastElementRef} className="h-20 w-full flex flex-col items-center justify-center gap-3 opacity-60 mt-4">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-pokered animate-spin"></div>
          <span className="text-sm font-bold tracking-wide text-slate-500">Loading more...</span>
        </div>
      )}
    </div>
  );
}
