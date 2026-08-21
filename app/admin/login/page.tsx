'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { login } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? 'Authenticating...' : 'Sign In'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop py-12">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display-lg-mobile text-2xl tracking-tighter text-primary block hover:opacity-80 transition-opacity"
          >
            Atelier North
          </Link>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-2">
            Admin Portal
          </p>
        </div>

        {/* Error Notification */}
        {state?.error && (
          <div className="mb-6 p-4 bg-surface-container border border-outline text-primary font-body-md text-sm">
            <p className="font-medium text-xs font-label-caps uppercase tracking-widest text-on-surface mb-1">
              Authentication Error
            </p>
            <p className="text-on-surface-variant">{state.error}</p>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@ateliernorth.com"
              className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md text-sm placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-outline-variant pt-6">
          <p className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider">
            Protected internal area. Public signups are disabled.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="font-nav-link text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
            >
              ← Back to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
