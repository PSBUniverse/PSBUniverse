# PSBUniverse

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Prerequisites:

- Node.js 20+ (Node 24 is confirmed working)
- npm 10+

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Then set these values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, required for login API)

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

Project documentation is available in the [`documentation/`](documentation/) folder.

- [Documentation Index](documentation/README.md)
- [Project Overview](documentation/project-overview.md)
- [Getting Started](documentation/getting-started.md)
- [Platform Architecture](documentation/platform/architecture.md)
- [Data Model](documentation/platform/data-model.md)
- [Gutter Application](documentation/applications/gutter.md)
- [Setup Global Application](documentation/applications/setup-global.md)
- [Setup Gutter Application](documentation/applications/setup-gutter.md)
- [Company Profile Application](documentation/applications/company-profile.md)
- [Home Application](documentation/applications/home.md)
- [OHD and Travel Application](documentation/applications/ohd-and-travel.md)
- [Libraries: Cache Layer](documentation/libraries/cache-layer.md)
- [Libraries: Supabase Client](documentation/libraries/supabase-client.md)
- [Libraries: Pricing Engine](documentation/libraries/pricing-engine.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
