import { Metadata } from 'next';
import Link from 'next/link';

interface SharePageProps {
  params: {
    id: string;
  };
}

// Decode the base64url id back into the actual Vercel Blob URL
function getImageUrl(id: string) {
  try {
    return Buffer.from(id, 'base64url').toString('utf-8');
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const imageUrl = getImageUrl(params.id);

  if (!imageUrl) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: 'My HH Goa 2026 Frame',
    description: 'Join me at HH Goa 2026! Generate your own builder frame.',
    openGraph: {
      title: 'My HH Goa 2026 Frame',
      description: 'Join me at HH Goa 2026! Generate your own builder frame.',
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1080,
          alt: 'HH Goa 2026 Frame',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [imageUrl],
    },
  };
}

export default function SharePage({ params }: SharePageProps) {
  const imageUrl = getImageUrl(params.id);

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--hhg-cream)] text-[var(--hhg-dark-green)] font-sans">
        <p>Pass not found</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative bg-[var(--hhg-cream)] bg-paper-texture">
      <div className="absolute inset-0 bg-dither-pattern opacity-10 pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center max-w-lg w-full gap-8">
        
        <div className="font-serif font-bold text-3xl tracking-tighter text-[var(--hhg-dark-green)]">
          HACKER <span className="text-[var(--hhg-pink)]">गोवा</span> HOUSE
        </div>

        <img 
          src={imageUrl} 
          alt="Generated Builder Pass" 
          className="w-full h-auto rounded-3xl shadow-2xl border-4 border-[var(--hhg-dark-green)]/20"
        />

        <Link 
          href="/generator"
          className="w-full bg-[var(--hhg-dark-green)] text-[var(--hhg-yellow)] font-bold py-4 rounded-xl hover:bg-[var(--hhg-forest)] transition-colors text-lg shadow-lg"
        >
          Make your own Builder Pass →
        </Link>
      </div>
    </main>
  );
}
