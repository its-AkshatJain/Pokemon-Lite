export const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeResponse {
  pokemon: {
    pokemon: PokemonListItem;
    slot: number;
  }[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
}

export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  return res.json();
}

export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon: ${nameOrId}`);
  return res.json();
}

export async function getPokemonTypes(): Promise<{ name: string; url: string }[]> {
  const res = await fetch(`${POKEAPI_BASE}/type`);
  if (!res.ok) throw new Error('Failed to fetch types');
  const data = await res.json();
  return data.results;
}

export async function getPokemonByType(type: string): Promise<PokemonListItem[]> {
  const res = await fetch(`${POKEAPI_BASE}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch pokemon by type: ${type}`);
  const data: PokemonTypeResponse = await res.json();
  return data.pokemon.map((p) => p.pokemon);
}

export function extractIdFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

export function getPokemonImageUrl(id: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Shared logic for useInfiniteQuery to be used by both SSR (page.tsx) and Client (HomeClient.tsx)
export async function fetchPokemonPage(pageParam: number, selectedType: string, limit = 24) {
  let listToProcess: PokemonListItem[] = [];
  let nextHasMore = false;

  if (selectedType) {
    const allOfType = await getPokemonByType(selectedType);
    listToProcess = allOfType.slice(pageParam * limit, (pageParam + 1) * limit);
    nextHasMore = allOfType.length > (pageParam + 1) * limit;
  } else {
    const response = await getPokemonList(limit, pageParam * limit);
    listToProcess = response.results;
    nextHasMore = !!response.next;
  }

  const detailedList = await Promise.all(
    listToProcess.map(async (pokemon) => {
      const id = extractIdFromUrl(pokemon.url);
      const details = await getPokemonDetails(id);
      return { ...pokemon, details };
    })
  );

  return {
    results: detailedList,
    nextPage: nextHasMore ? pageParam + 1 : undefined,
  };
}
