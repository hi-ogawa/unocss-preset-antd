# misc/vercel

scripts for vercel deployment

```sh
# initial setup
vercel projects add tiny-toast-hiro18181
vercel link -p tiny-toast-hiro18181

# release
pnpm build
pnpm release-demo-production
```
