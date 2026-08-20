# Risks and Open Questions - Atelier North Properties

## Risks

### 1. Image Optimization Costs
- **Risk**: Supabase Transformations may incur costs at scale when generating multiple image variants (thumbnail, medium, large, AVIF/WebP)
- **Likelihood**: Medium - Free tier has generous limits, but high traffic properties could exceed
- **Impact**: Additional costs for storage and CDN bandwidth
- **Mitigation**: 
  - Set reasonable size limits on uploads (<10MB)
  - Use client-side compression before upload
  - Monitor storage usage via Supabase Dashboard
  - Consider client-only image processing for very high volumes
  - Start with single format (AVIF with JPEG fallback)

### 2. Supabase Auth Complexity
- **Risk**: Managing roles, permissions, and session state may become complex as admin needs grow
- **Likelihood**: Medium - Free tier has auth limits, role management is manual
- **Impact**: Admins unable to access CMS, security vulnerabilities
- **Mitigation**: 
  - Start simple: email/password only, add magic links later
  - Use Supabase built-in role system initially
  - Test all auth flows before production launch
  - Document admin onboarding process
  - Keep auth UI simple and well-tested

### 3. SEO for Dynamic Property Pages
- **Risk**: Property detail pages may not be properly indexed by search engines if not generated correctly
- **Likelihood**: Medium - Next.js ISR helps, but dynamic routes can be tricky
- **Impact**: Properties not found in search results, reduced traffic
- **Mitigation**: 
  - Use Next.js metadata API with dynamic title/description
  - Generate sitemap.xml with all published properties
  - Ensure slug-based routes are stable and never change
  - Test Google Search Console indexing after launch
  - Consider static generation for high-priority properties

### 4. Mobile Gallery Performance
- **Risk**: Handling many high-resolution images on mobile devices could cause performance issues (slow load, memory issues)
- **Likelihood**: High - Users may upload 20+ images per property
- **Impact**: Poor user experience, high bounce rate on mobile
- **Mitigation**: 
  - Implement lazy loading (only current + 1 adjacent image)
  - Use responsive images with appropriate sizes (srcset)
  - Generate WebP/AVIF versions with automatic fallback
  - Set maximum gallery size (e.g., 20 images) or pagination
  - Use blurred placeholders during load
  - Virtualize gallery for very large collections

### 5. CMS Usability for Non-Technical Users
- **Risk**: Non-technical admins may find the CMS interface confusing or unintuitive
- **Likelihood**: High - Drag/drop, image management, publishing workflows can be complex
- **Impact**: Low property update frequency, admin frustration, support tickets
- **Mitigation**: 
  - Focus on intuitive UX over feature completeness
  - Provide clear validation errors and success messages
  - Include preview mode before publishing
  - Test with actual non-technical users if possible
  - Keep workflows linear and guided (step-by-step wizard)
  - Add tooltips and helper text where needed

### 6. Browser Compatibility
- **Risk**: Certain features may not work across all browsers (especially older ones)
- **Likelihood**: Medium - Next.js + Tailwind is generally compatible, but some CSS/JS features may vary
- **Impact**: Broken layouts or functionality for some users
- **Mitigation**: 
  - Test on Chrome, Firefox, Safari (latest versions)
  - Use feature detection where needed
  - Provide fallbacks for unsupported features (e.g., no-touch gestures on non-touch devices)
  - Set browser support policy (e.g., last 2 versions)

### 7. Data Migration from Mock to Live
- **Risk**: Property data may not migrate cleanly from mock to database format
- **Likelihood**: Low - Simple schema, but data format differences could cause issues
- **Impact**: Lost properties, broken links, missing images
- **Mitigation**: 
  - Write migration script if needed
  - Test with sample data before going live
  - Keep mock data as fallback temporarily
  - Verify all properties display correctly after migration
  - Document data format expectations

### 8. Supabase Free Tier Limits
- **Risk**: Project may outgrow Supabase free tier limits (storage, bandwidth, auth operations)
- **Likelihood**: Medium - Free tier is generous but not unlimited
- **Impact**: Service interruption, need to upgrade plan
- **Mitigation**: 
  - Monitor usage via Supabase Dashboard
  - Set up alerts for approaching limits
  - Budget for paid tier if needed (~$25/month for Pro)
  - Design with upgrade path in mind (no breaking changes)
  - Start with essential features only, add later

## Open Questions

### 1. Property Favoriting/Saving
- **Question**: Should users be able to favorite/save properties for later reference?
- **Current Decision**: Not in MVP scope
- **Consideration**: Could be Phase 11 feature; would require user accounts beyond admin
- **Decision**: Defer to post-launch based on user feedback

### 2. Multilingual Support
- **Question**: Should the site support multiple languages beyond English?
- **Current Decision**: English-only for MVP
- **Consideration**: Structure should support i18n if needed later (URL patterns, date/currency formatting)
- **Decision**: Build with i18n-ready structure but default to English

### 3. Advanced Search/Filtering
- **Question**: Should there be map-based search, price sliders, or keyword search?
- **Current Decision**: Basic filters only (type, location, status) for MVP
- **Consideration**: Map integration would require external API (Google Maps), price sliders need range queries
- **Decision**: MVP has basic filters; advanced search possible in Phase 2 based on demand

### 4. External CRM/Email Integration
- **Question**: Should enquiries integrate with external CRM (HubSpot, Salesforce) or email marketing?
- **Current Decision**: Simple email form (Resend/SendGrid) only
- **Consideration**: CRM integration would require webhooks, API keys, compliance (GDPR)
- **Decision**: Basic form submission only for MVP; integrations possible later

### 5. Analytics and Tracking
- **Question**: What analytics are needed (page views, property views, conversion tracking)?
- **Current Decision**: Basic page view tracking via Plausible or Google Analytics 4
- **Consideration**: Enhanced e-commerce tracking not needed for brochure site
- **Decision**: Essential analytics only (traffic, popular properties)

### 6. Property Status Workflow
- **Question**: Should there be a more granular status than ('available', 'under_offer', 'sold', 'off_market')?
- **Current Decision**: 4-status check constraint is sufficient
- **Consideration**: 'Coming Soon', 'Withdrawn', 'Reserved' could be added later
- **Decision**: Keep simple for MVP; expand if business needs dictate

### 7. Image Watermarking
- **Question**: Should property images have automatic watermarks for branding?
- **Current Decision**: No watermarking in MVP
- **Consideration**: Could add via Supabase Functions or client-side
- **Decision**: Defer; brand visibility comes from site header/footer

### 8. Dietary Restrictions for Gallery
- **Question**: Maximum number of gallery images per property, or unlimited?
- **Current Decision**: Unlimited but practical limit (~50) via UI/UX controls
- **Consideration**: Performance implications, storage costs
- **Decision**: Set reasonable expectation (e.g., 20-30 images typical), lazy load beyond first 10

### 9. Backup Strategy
- **Question**: Automated database backups, retention policy, disaster recovery?
- **Current Decision**: Supabase provides automated backups on paid tiers; manual on free
- **Consideration**: Important for data safety
- **Decision**: Set up manual export schedule; consider Supabase Pro for automated backups

### 10. Real-time Updates
- **Question**: Should property changes (publish status, price changes) reflect in real-time on the public site?
- **Current Decision**: ISR (revalidate on interval) rather than real-time subscriptions
- **Consideration**: Supabase Realtime possible but adds complexity
- **Decision**: ISR sufficient for brochure site; Realtime optional for future

### 11. Contact Form Spam
- **Question**: How to prevent contact form spam without CAPTCHA?
- **Current Decision**: honeypot field + rate limiting, optional reCAPTCHA v3
- **Consideration**: Balance spam prevention with user experience
- **Decision**: honeypot + rate limiting first; reCAPTCHA v3 as fallback if spam high

### 12. Dark Mode Preference Persistence
- **Question**: Should dark mode preference be remembered across sessions?
- **Current Decision**: Yes, via localStorage with system preference fallback
- **Consideration**: Some users prefer forced light mode for accessibility
- **Decision**: Respect user preference, add toggle to override system

## Decision Matrix for Open Questions

| Question | Default Choice | When to Change |
|----------|---------------|----------------|
| Favoriting | Defer | User demand > 30% of surveys |
| Multilingual | English-only | International expansion request |
| Advanced search | Basic filters | Search usability testing reveals need |
| CRM integration | Basic form | Enterprise customer request |
| Analytics | Basic page views | Requirement from stakeholder |
| Status workflow | 4-status | Business process change |
| Watermarking | No | Brand protection needs |
| Image limit | Unlimited (practical) | Performance issues identified |
| Backups | Manual export | Data loss incident |
| Real-time | ISR only | User demand for instant updates |
| Form spam | honeypot + rate limit | Spam rate exceeds threshold |
| Dark mode | Remember preference | Accessibility requirements |