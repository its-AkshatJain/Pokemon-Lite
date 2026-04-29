import { signIn, signOut, auth } from "@/auth"
import Image from "next/image"

export async function AuthButton() {
  const session = await auth()

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <button
          type="submit"
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-2 px-1 py-1 sm:px-2 sm:py-1 bg-slate-100 rounded-full border border-slate-200">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User Avatar"}
            width={24}
            height={24}
            className="rounded-full w-6 h-6 sm:w-7 sm:h-7"
          />
        )}
        <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden sm:block pr-2">
          {session.user.name?.split(" ")[0]}
        </span>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button
          type="submit"
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 text-slate-500 hover:text-red-500 hover:bg-red-50"
        >
          Sign Out
        </button>
      </form>
    </div>
  )
}
