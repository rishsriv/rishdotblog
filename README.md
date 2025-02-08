# Personal Blog

My personal blog. Mostly using this to explore frameworks beyond NextJS. It is currently built on [React Router](https://reactrouter.com/), which is all sorts of awesome.

## Tech Stack

- ⚛️ React with TypeScript
- 🛣️ React Router for SSR and SEO
- 🎨 TailwindCSS for styling
- ✍️ TipTap for rich text editing (mostly as an internal editor)
- 📝 MDX for content management
- 🚀 Vite for fast development

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

- `/app` - Core application code
- `/public` - Static assets
- `/build` - Production build output

## Features

- Server-side rendering for optimal performance
- Markdown/MDX support for blog posts
- Modern, responsive design
- TypeScript for type safety
- Hot Module Replacement (HMR) for rapid development

## License

MIT
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---