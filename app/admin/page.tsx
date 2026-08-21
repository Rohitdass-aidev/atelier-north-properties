import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="border-b border-outline-variant pb-8">
        <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal">
          Dashboard
        </h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          Signed in as <span className="text-primary font-medium">{user.email}</span>
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-low border border-outline-variant p-6">
          <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-2">
            Authentication Status
          </p>
          <p className="font-display text-2xl text-primary mb-1">Authenticated</p>
          <p className="font-body-md text-xs text-on-surface-variant">
            Session active via Supabase Auth cookies
          </p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6">
          <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-2">
            Database Foundation
          </p>
          <p className="font-display text-2xl text-primary mb-1">Phase 2A Complete</p>
          <p className="font-body-md text-xs text-on-surface-variant">
            Tables, RLS &amp; Storage verified
          </p>
        </div>

        <Link
          href="/admin/properties"
          className="bg-surface-container-low border border-outline-variant p-6 hover:bg-surface-container transition-colors block group"
        >
          <div className="flex justify-between items-start">
            <p className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-2">
              Management
            </p>
            <span className="font-nav-link text-xs uppercase tracking-widest text-primary group-hover:translate-x-1 transition-transform">
              View →
            </span>
          </div>
          <p className="font-display text-2xl text-primary mb-1">Properties CMS</p>
          <p className="font-body-md text-xs text-on-surface-variant">
            View, inspect &amp; manage portfolio properties
          </p>
        </Link>
      </div>
    </div>
  );
}
