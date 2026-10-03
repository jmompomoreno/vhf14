# VHF14

Plataforma VHF14 sobre **Cloudflare Workers + D1** (Next/Vinext, React 19, Drizzle ORM).
Producción: https://vhf14.com

## Desarrollo local
```bash
pnpm install --frozen-lockfile
printf 'VHF14_ADMIN_EMAILS=tu@email.com\nVHF14_SETUP_CODE=codigo-local\n' > .dev.vars
pnpm run build
npx wrangler d1 migrations apply DB --local
```

## Despliegue
Cada `git push` a `main` se compila y se publica automáticamente (Cloudflare Workers Builds):

- Comando de compilación: `pnpm install --frozen-lockfile && pnpm run build`
- Comando de despliegue: `node scripts/cf-deploy.mjs`

## Base de datos
Las migraciones están en `drizzle/`. Si añades una, aplícala en producción **antes** de subir el cambio:
```bash
npx wrangler d1 migrations apply vhf14-db --remote
```

## Secretos (en Cloudflare, nunca en el repo)
`VHF14_ADMIN_EMAILS` (emails de administrador, separados por coma) y `VHF14_SETUP_CODE`.
