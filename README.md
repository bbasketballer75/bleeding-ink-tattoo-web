# Bleeding Ink Tattoo

Marketing + booking website for [Bleeding Ink](https://bleedinginktattoo.com) — a custom tattoo shop at the Johnstown Galleria in Johnstown, PA.

- **Domain**: bleedinginktattoo.com
- **Shop**: 500 Galleria Dr, Johnstown PA 15904
- **Phone**: (215) 980-1386
- **Hours**: Closed Sun & Mon · Tue–Sat 11:00 AM – 7:00 PM
- **Instagram**: [@ibleedink_600](https://www.instagram.com/ibleedink_600/)
- **Facebook**: [Bleeding Ink Tattooing](https://www.facebook.com/BleedingInkTattooing/)

## Development

```bash
npm install
npm run dev    # localhost:3009
npm run build
npm run start
npm run lint
```

See `AGENTS.md` for project conventions, brand tokens, and known pitfalls.

## Project Status

Stage 3 build in progress as of 2026-08-17.

## Deploying

Pushed to GitHub: https://github.com/bbasketballer75/bleeding-ink-tattoo-web

Auto-deploys to Vercel via the Vercel GitHub integration. Custom domain:
`bleedinginktattoo.com`.

To redeploy manually after a code change:

```bash
cd bleeding-ink-tattoo-web
git push origin main   # Vercel picks up the push and rebuilds
```

Environment variables (Vercel dashboard → Project Settings):

| Name | Required for | Description |
|------|--------------|-------------|
| `RESEND_API_KEY` | Contact form | Sign up at https://resend.com — free tier OK |
| `RESEND_FROM_EMAIL` | Contact form | e.g. `Bleeding Ink <hello@bleedinginktattoo.com>` |
| `RESEND_TO_EMAIL` | Contact form | Where contact submissions land (use the Gmail) |

See `LAUNCH-CHECKLIST.md` for the full pre-launch sequence (domain buy,
GlossGenius setup, directory claims). See the planning notes in `C:\Users\bbask\Hermes-Workspace\bleeding-ink-website\` for intake, research, and the full Stage 3 bite-sized build plan.