'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Navbar({ authButton }: { authButton?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-slate-200/50 shadow-[0_4px_30px_rgb(0,0,0,0.02)] transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-6 h-20 flex items-center justify-between gap-2">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 outline-none group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-pokered flex items-center justify-center relative overflow-hidden group-hover:rotate-180 transition-transform duration-700 ease-in-out shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <div className="w-full h-1/2 bg-pokered absolute top-0"></div>
            <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
            <div className="w-full h-1 bg-slate-900 absolute top-1/2 -translate-y-1/2"></div>
            <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-slate-900"></div>
          </div>
          <span className="text-2xl sm:text-3xl font-black font-outfit tracking-tighter text-slate-800">
            Poké<span className="text-pokered">dex</span>
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white/80 p-1 sm:px-3 sm:py-2 rounded-full border border-slate-100 shadow-sm shrink-0">
          <Link 
            href="/" 
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${
              pathname === '/' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/favorites" 
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5 transition-all duration-300 ${
              pathname === '/favorites' 
                ? 'bg-pokered text-white shadow-md shadow-pokered/20' 
                : 'text-slate-500 hover:text-pokered hover:bg-red-50'
            }`}
          >
            Favs
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={pathname === '/favorites' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={pathname === '/favorites' ? "text-white" : "text-pokered/70"}>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </Link>
          {authButton && (
            <>
              <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>
              {authButton}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
