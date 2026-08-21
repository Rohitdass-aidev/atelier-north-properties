import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { logout } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user (e.g. on /admin/login), render children directly without admin shell
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Admin Shell Header */}
      <header className="sticky top-0 z-40 w-full bg-surface-container-low border-b border-outline-variant px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-display text-xl md:text-2xl tracking-tighter text-primary hover:opacity-80 transition-opacity"
          >
            Atelier North Properties
          </Link>
          <span className="hidden sm:inline-block font-label-caps text-xs uppercase tracking-widest text-on-surface-variant bg-surface-dim px-2.5 py-0.5 border border-outline-variant">
            Admin
          </span>
        </div>

        {/* Navigation & Logout */}
        <nav className="flex items-center gap-6 md:gap-8 font-nav-link text-nav-link uppercase tracking-widest">
          <Link
            href="/admin"
            className="text-primary hover:text-secondary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/properties"
            className="text-on-surface-variant hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
          >
            Properties
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest cursor-pointer border-b border-outline-variant hover:border-primary pb-0.5"
            >
              Logout
            </button>
          </form>
        </nav>
      </header>

      {/* Admin Shell Content */}
      <main className="flex-grow px-margin-mobile md:px-margin-desktop py-8 md:py-12 max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
