# Toronto Basement Underpinning - Website Source Code

## Quick Start

1. Extract this ZIP file to a folder

2. Open the folder in your code editor (Cursor, Windsurf, VS Code)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:4321 in your browser

## Build for Production

```bash
npm run build
```

The compiled website will be in the `dist/` folder.

## Customization Tips

- **Edit content**: Files in `src/content/` (blog posts, services)
- **Modify pages**: Files in `src/pages/`
- **Update config**: Files in `src/config/` (business info, homepage, about, FAQ)
- **Update styling**: `tailwind.config.mjs` for colors and theme
- **Replace images**: Files in `public/` folder

## Town Subsites

If this project has town subsites, you can edit and rebuild them locally.

### Edit a Town

Town content is in `towns/{town-id}/`:
- `towns/{town-id}/config/` — Business info, homepage, about, FAQ, navigation
- `towns/{town-id}/content/services/` — Service pages (MDX)
- `towns/{town-id}/content/blog/` — Blog posts (MDX)
- `towns/{town-id}/public/` — Town-specific assets (logo, images)

### Build a Town

```bash
node tools/build-town.mjs {town-id}
```

This swaps the town content into the site, builds it, outputs to `dist-{town-id}/`, then restores the master content.

### Preview a Town

```bash
npx serve dist-{town-id}
```

### Deploy a Town

```bash
npx wrangler pages deploy dist-{town-id} --project-name={project}-{town-id}
```

### List Available Towns

```bash
node tools/build-town.mjs
```

Running without arguments lists all available town IDs.

## Requirements

- Node.js 18 or higher
- npm or pnpm
