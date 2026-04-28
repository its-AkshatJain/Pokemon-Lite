import { getPokemonDetails, getPokemonImageUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} | Pokedex Lite`,
  };
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

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  let details;
  try {
    details = await getPokemonDetails(name.toLowerCase());
  } catch (e) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold font-outfit mb-4">Pokemon Not Found</h1>
        <Link href="/" className="text-pokered hover:underline">Return to Home</Link>
      </div>
    );
  }

  const imageUrl = details.sprites?.other?.['official-artwork']?.front_default || getPokemonImageUrl(details.id.toString());
  const primaryType = details.types[0]?.type.name || 'normal';
  const typeColor = TYPE_COLORS[primaryType] || '#A8A77A';

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 mb-8 text-slate-500 hover:text-pokered transition-colors font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Pokedex
      </Link>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
        {/* Abstract Shape Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ color: typeColor }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] md:w-[100%] md:h-[100%] md:top-[-10%] md:left-[-10%] transform rotate-12">
            <path fill="currentColor" d="M45.7,-76.1C58.9,-69.3,69.1,-55.4,76.5,-40.4C83.9,-25.4,88.5,-9.3,86.8,6.2C85.1,21.7,77.1,36.6,66.3,48.5C55.5,60.4,41.9,69.3,26.7,75.1C11.5,80.9,-5.3,83.6,-21.4,79.9C-37.5,76.2,-52.9,66.1,-63.9,53.2C-74.9,40.3,-81.5,24.6,-83.4,8.5C-85.3,-7.6,-82.5,-24.1,-74.2,-37.7C-65.9,-51.3,-52.1,-62,-37.8,-68.4C-23.5,-74.8,-8.7,-76.9,6.7,-79C22.1,-81.1,44.2,-83.2,45.7,-76.1Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
              <Image 
                src={imageUrl} 
                alt={details.name}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-400 tracking-widest mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"/>
                  <path d="M2 12h10M22 12h-10"/>
                </svg>
                {details.id.toString().padStart(4, '0')}
              </div>
              <h1 className="text-5xl font-black font-outfit capitalize text-slate-800 tracking-tight">
                {details.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {details.types.map(({ type }) => (
                <span 
                  key={type.name} 
                  className="px-4 py-1.5 rounded-full text-white font-bold text-sm tracking-wide capitalize shadow-sm"
                  style={{ backgroundColor: TYPE_COLORS[type.name] || '#A8A77A' }}
                >
                  {type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center shadow-sm">
                <span className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Height</span>
                <span className="text-2xl font-bold text-slate-800">{(details.height / 10).toFixed(1)}m</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center shadow-sm">
                <span className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Weight</span>
                <span className="text-2xl font-bold text-slate-800">{(details.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-outfit mb-4 text-slate-800">Base Stats</h3>
              <div className="space-y-3">
                {details.stats.map(({ stat, base_stat }) => {
                  const maxStat = 255;
                  const percentage = (base_stat / maxStat) * 100;
                  return (
                    <div key={stat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold capitalize text-slate-500">
                          {stat.name.replace('-', ' ')}
                        </span>
                        <span className="font-bold text-slate-700">{base_stat}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: typeColor }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-outfit mb-3 text-slate-800">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {details.abilities.map(({ ability, is_hidden }) => (
                  <span 
                    key={ability.name}
                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl capitalize font-medium text-sm flex items-center gap-1 text-slate-700 shadow-sm"
                  >
                    {ability.name.replace('-', ' ')}
                    {is_hidden && <span className="text-xs ml-1 font-bold" style={{ color: typeColor }}>(Hidden)</span>}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
