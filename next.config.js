import withPWAInit from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const repoName = 'alur-jkn';

const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

/**
 * DESIGN.md v3 §18, "the one permitted dependency": a build-time-only
 * service-worker generator, not a runtime script. `disable` in
 * development so `pnpm dev` never serves a cached, stale build while
 * iterating. `register`/`skipWaiting` so the worker takes over
 * immediately on first load rather than waiting for a second navigation
 * — DESIGN.md §10's "offline after first load" claim, not "offline after
 * the load after that."
 */
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
});

export default withPWA(nextConfig);
