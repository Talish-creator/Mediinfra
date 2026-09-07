# MediInfra — Development Guidelines

MediInfra is an Enterprise Hospital Infrastructure & IoT Safety Command Platform built with TanStack Start, React 19, Tailwind CSS, and Nitro.

## Code Standards
- Maintain strict TypeScript type safety (`npx tsc --noEmit`).
- Follow the established design system tokens and enterprise UI components under `src/components/mediinfra`.
- Preserve state continuity in `src/lib/mediinfra-store.tsx`.
- Keep bundle size minimal by avoiding extraneous third-party packages.

