# JESTFLY - Astro Platform

A high-performance web platform for music artists, content creators, and fans built with Astro and Islands Architecture.

## About This Project

JESTFLY is being rebuilt with **Astro** to achieve:
- **40% faster load times** compared to React-only frameworks
- **90% less JavaScript** shipped to browsers
- **Perfect Lighthouse scores** out of the box
- **SEO optimization** with server-side rendering
- **Interactive features** using React islands where needed

## Tech Stack

- **Astro 5.x** - Modern static site generator
- **React 19** - Interactive islands
- **Tailwind CSS v4** - Modern styling
- **Supabase** - Authentication, database, storage
- **TypeScript** - Type safety

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (for backend)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components (Astro + React)
│   │   ├── ui/         # Reusable UI components
│   │   ├── auth/       # Authentication components
│   │   ├── community/  # Community features
│   │   ├── store/      # E-commerce components
│   │   └── ...
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   ├── lib/            # Utilities and services
│   │   ├── supabase/  # Supabase clients
│   │   ├── utils/     # Helper functions
│   │   └── stores/    # State management
│   ├── middleware/     # Auth middleware
│   ├── config/        # Configuration
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
└── astro.config.mjs    # Astro configuration
```

## Key Features

### Current (Phase 1 Complete)
- ✅ Astro setup with React integration
- ✅ Tailwind CSS with design system
- ✅ Supabase client configuration
- ✅ Base layouts and navigation
- ✅ Home page and placeholder pages
- ✅ Production build working

### In Development (See ROADMAP.md)
- Authentication system
- Community features
- Demo submission
- JestCoin wallet
- E-commerce store
- NFT gallery
- Career planning canvas
- Analytics dashboard
- Admin interface
- Live streaming

## Islands Architecture

Astro uses "Islands Architecture" where most of your page is static HTML, and only interactive parts are hydrated with JavaScript.

### Hydration Strategies

```astro
<!-- Load immediately -->
<Component client:load />

<!-- Load when visible -->
<Component client:visible />

<!-- Load when browser is idle -->
<Component client:idle />

<!-- Client-only, no SSR -->
<Component client:only="react" />
```

## Development

### Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

### Environment Variables

Required variables in `.env`:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Performance Goals

- **Lighthouse Score:** 100/100
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Total Bundle Size:** < 100KB (excluding images)

## Contributing

1. Check ROADMAP.md for current priorities
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Documentation

- [Astro Documentation](https://docs.astro.build)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Roadmap](./ROADMAP.md)

## License

Copyright © 2024 JESTFLY. All rights reserved.

---

**Status:** Phase 1 Complete - Foundation established
**Next:** Phase 2 - Authentication & User Management
