import Link from "next/link";
import { User, Users, IdCard } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Sunrise background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--hhg-navy)] via-[var(--hhg-sunrise-1)] to-[var(--hhg-sunrise-2)] opacity-30 pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center max-w-md w-full gap-8">
        <div className="space-y-4">
          <p className="font-mono text-sm tracking-widest text-[var(--hhg-accent)]">28-31 OCT 2026 · GOA, INDIA</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Make Your<br/><span className="text-[var(--hhg-sunrise-2)]">#FrameInGoa</span></h1>
          <p className="text-[var(--hhg-sand)]/80 text-lg">Lock in and build your legacy. Generate your official builder badge.</p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-8">
          <Link href="/generator?mode=solo" className="flex items-center gap-4 bg-black/40 hover:bg-black/60 border border-[var(--hhg-sand)]/20 p-4 rounded-xl transition-all backdrop-blur-md group">
            <div className="bg-[var(--hhg-accent)]/20 p-3 rounded-lg text-[var(--hhg-accent)] group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg">PFP Frame</h3>
              <p className="text-sm text-[var(--hhg-sand)]/60">Single photo profile picture</p>
            </div>
          </Link>

          <Link href="/generator?mode=card" className="flex items-center gap-4 bg-black/40 hover:bg-black/60 border border-[var(--hhg-sand)]/20 p-4 rounded-xl transition-all backdrop-blur-md group">
            <div className="bg-[var(--hhg-sunrise-1)]/20 p-3 rounded-lg text-[var(--hhg-sunrise-1)] group-hover:scale-110 transition-transform">
              <IdCard size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg">🌴 Builder ID</h3>
              <p className="text-sm text-[var(--hhg-sand)]/60">Photo + Stack + Auto Title</p>
            </div>
          </Link>

          <Link href="/generator?mode=squad" className="flex items-center gap-4 bg-black/40 hover:bg-black/60 border border-[var(--hhg-sand)]/20 p-4 rounded-xl transition-all backdrop-blur-md group">
            <div className="bg-[var(--hhg-sunrise-2)]/20 p-3 rounded-lg text-[var(--hhg-sunrise-2)] group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg">Squad Frame</h3>
              <p className="text-sm text-[var(--hhg-sand)]/60">2-3 photos combined</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
