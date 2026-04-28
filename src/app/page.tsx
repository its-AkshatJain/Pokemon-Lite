import HomeClient from '@/components/HomeClient';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-outfit text-center mb-4 tracking-tight">
          Welcome to <span className="text-pokered">Pokedex</span> Lite
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl">
          Search for Pokémon by name or filter by type to see their details.
        </p>
      </div>
      <HomeClient />
    </main>
  );
}
