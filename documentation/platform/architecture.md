# Architecture

## Rendering Model

The application is organized with Next.js App Router routes under src/app. Route pages are written as client components because they rely on local state, form interactions, and browser cache APIs.

## UI Composition

- Shared visual style comes from src/app/globals.css.
- Components use React-Bootstrap primitives.
- Navigation is route-driven through Link and useRouter.

## Data Access Layer

- Supabase client is initialized in src/lib/supabase.js.
- Feature routes execute Supabase queries directly or through cache-aware wrappers.

## Shared Library Layer

- src/lib/pricingEngine.js centralizes gutter quote math.
- src/lib/cache/clientCache.js provides generic browser cache primitives.
- src/lib/cache/supabaseCache.js adds Supabase query wrappers backed by cache.
- src/lib/userMasterAccess.js centralizes user CRUD and role-to-app access resolution.

## Access Control Layer

- User identity records are managed in psb_s_user.
- Role/application mappings are resolved from psb_m_userappproleaccess.
- Effective access is derived in backend code from (user_id, role_id, app_id).
- The devmain role bypasses standard checks and receives full CRUD access.

## Cache Namespace Strategy

The project currently uses namespace psb-universe with dynamic keys such as:

- setup:statuses
- setup:manufacturers
- projects:list
- projects:detail:<id>
- company:profile

## Mutation Consistency Pattern

On create/update/delete flows:

1. Execute database mutation.
2. Invalidate affected cache keys.
3. Refetch with forceFresh to avoid stale UI.
