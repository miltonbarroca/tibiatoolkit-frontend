# Tibia Toolkit — Frontend

Landing page do [Tibia Toolkit](https://github.com/miltonbarroca/Tibia-Toolkit). Repositório
separado do monorepo para simplificar o deploy (Vercel + domínio próprio `tibiatoolkit.com.br`).

**Stack:** React 19 + Vite + TypeScript + Sass (SCSS). Sem Tailwind.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local (Vite)
npm run build    # gera dist/
npm run preview  # serve o build local
```

## Estrutura

```
src/
  App.tsx              # landing single-file (componentes por seção)
  main.tsx             # entry React
  assets/logo.png
  styles/
    main.scss          # entry: @use de todos os partials
    _tokens.scss       # cores oklch + fontes (CSS custom properties)
    _breakpoints.scss  # $bp-md / $bp-lg + mixins de media query
    _base.scss         # reset, body, .container, utilitários, .section
    _animations.scss   # keyframes + classes .animate-*
    _components.scss    # .btn, cards, badges, FAQ, download
    _layout.scss       # nav, hero, features, pricing, footer
```

Classes seguem um BEM enxuto (`bloco__elemento--modificador`). As cores ficam como
CSS custom properties em `_tokens.scss` (oklch), então dá pra ajustar o tema num lugar só.

## Backend

A constante `BACKEND` em `src/App.tsx` aponta os botões de download para a API:

```ts
const BACKEND = "https://tibia-toolkit-production.up.railway.app";
```

Quando a API mudar de endereço (ex.: `api.tibiatoolkit.com.br`), alterar só aqui.

## Analytics (Umami, first-party)

`index.html` carrega `/stats/script.js` e o tracker envia eventos para `/api/send` —
ambos **relativos ao próprio domínio**. O `vercel.json` reescreve esses dois caminhos
para o backend (que proxia o Umami Cloud). Resultado: tudo é first-party, escapa de
adblockers e não precisa de CORS.

Eventos: cliques de download disparam `download` com `platform: windows|linux`
(via `data-umami-event`).

## Documentação e páginas do backend

`/documentacao` (e `/termos`, `/privacidade`) são páginas servidas pelo **backend**
(`backend/static/docs/docs.html` + assets em `/static/docs/`), mantidas lá como fonte
única. Em vez de duplicar/forkar a doc neste repo, esses caminhos são **proxiados** pro
Railway:

- **Dev:** `vite.config.ts` → `server.proxy` repassa `/documentacao`, `/termos`,
  `/privacidade` e `/static` pro `BACKEND`.
- **Produção:** `vercel.json` → `rewrites` faz o mesmo.

Para pré-visualizar edições locais da doc, suba o backend (`uvicorn main:app --reload`)
e troque `BACKEND` em `vite.config.ts` para `http://localhost:8000`.

## Deploy (Vercel)

1. Importar este repo na Vercel (detecta Vite automaticamente; build `npm run build`, output `dist/`).
2. Apontar o domínio `tibiatoolkit.com.br` para a Vercel.
3. O `vercel.json` já cuida do proxy do Umami.

### Pendências de cutover (quando migrar de vez)

- [x] **Rotas servidas pelo backend** (`/documentacao`, `/termos`, `/privacidade`, `/static/*`):
      já proxiadas pro Railway — `vercel.json` (produção) e `vite.config.ts` `server.proxy`
      (dev). Fonte única no backend; não duplicamos a doc aqui (ver seção "Documentação").
- [ ] **Stripe**: atualizar `success_url` / `cancel_url` do Checkout pro novo domínio.
- [ ] **Backend CORS**: liberar `tibiatoolkit.com.br` se algum fetch passar a bater
      direto na API (o Umami não precisa, pois usa rewrite first-party).
- [ ] **Monorepo**: remover `deploy-frontend.yml` e `frontend/` do
      `Tibia-Toolkit` só **depois** que este deploy estiver no ar (evita derrubar a
      landing atual durante a transição).

O cliente desktop não muda (já usa a const `BACKEND`).
