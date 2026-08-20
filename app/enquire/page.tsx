'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function EnquireForm() {
  const searchParams = useSearchParams();
  const initialProperty = searchParams.get('property') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: initialProperty,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Local mock submission for Phase 1
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-gutter">
        {/* Left Column: Title & Office Details */}
        <div className="md:col-span-5 md:col-start-1 flex flex-col justify-between">
          <div>
            <h1 className="font-display-xl text-display-lg md:text-display-xl text-primary font-normal leading-tight mb-8">
              Enquire
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-12">
              Whether you are looking to acquire a residence from our portfolio, discuss a private
              sale, or seek architectural advisory, our team operates with complete discretion.
            </p>
          </div>

          <div className="space-y-8 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-t border-outline-variant pt-8">
            <div>
              <span className="text-outline block mb-1">Offices</span>
              <p className="text-primary normal-case font-medium text-sm">London &amp; Cornwall</p>
            </div>
            <div>
              <span className="text-outline block mb-1">Direct Communication</span>
              <a
                href="mailto:enquiries@ateliernorth.com"
                className="text-primary hover:text-secondary transition-colors lowercase normal-case text-sm block"
              >
                enquiries@ateliernorth.com
              </a>
              <p className="text-on-surface-variant normal-case text-sm mt-1">+44 (0) 20 7946 0912</p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Editorial Form */}
        <div className="md:col-span-6 md:col-start-7 bg-surface-container-low p-8 md:p-12 border border-outline-variant">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <h2 className="font-headline-md text-headline-md text-primary font-normal">
                Thank you for your enquiry
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                A member of our senior advisory team will review your message and contact you
                within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 font-label-caps text-label-caps uppercase tracking-widest border-b border-primary text-primary pb-1"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 7000 000000"
                    className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                  Property or Advisory of Interest
                </label>
                <input
                  type="text"
                  value={formData.propertyInterest}
                  onChange={(e) => setFormData({ ...formData, propertyInterest: e.target.value })}
                  placeholder="e.g. The Cliff House, Acquisition in Mayfair..."
                  className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">
                  Message / Requirements
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide any specific timelines or requirements..."
                  className="w-full px-4 py-3 bg-surface border border-outline-variant text-primary font-body-md placeholder:text-outline focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Submit Confidential Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EnquirePage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-label text-sm">Loading enquiry form...</div>}>
      <EnquireForm />
    </Suspense>
  );
}
