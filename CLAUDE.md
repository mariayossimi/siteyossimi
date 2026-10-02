# Yossimi Solutions — site institucional

Site estático (sem build tool) da Yossimi Solutions, consultoria de Duda (Maria Eduarda)
que cria sites, otimiza Perfil de Empresa no Google e automatiza WhatsApp (agendamentos,
lembretes, cobranças) pra negócios locais.

## Stack

- HTML/CSS/JS puro, sem framework, sem bundler. Nada de `npm install`/build step.
- Animações: GSAP + ScrollTrigger (scroll reveals) e Lenis (smooth scroll).
  Carregados via CDN (jsdelivr) **com SRI** (`integrity` + `crossorigin="anonymous"`)
  — se trocar a versão de uma lib, recalcule o hash (`openssl dgst -sha384 -binary | openssl base64 -A`).
- Fontes: Google Fonts (Plus Jakarta Sans + Fraunces).
- Deploy: Vercel, projeto `yossimisolutions` (**não** `siteyossimi` — foi renomeado).
  Domínio principal: `yossimisolutions.vercel.app`. O domínio antigo `siteyossimi.vercel.app`
  tem redirect 308 permanente pro novo — não reverter isso.
- Git: repo `mariayossimi/siteyossimi` no GitHub, conectado ao projeto Vercel.
  **Push na branch `main` já faz deploy automático** — não é mais preciso rodar
  `vercel deploy` manualmente (mas ainda funciona como fallback: `npx vercel deploy --prod --yes`,
  às vezes dá um erro transitório "Not authorized" na primeira tentativa — só rodar de novo).

## Estrutura

- `index.html` — página principal em português (fonte da verdade do conteúdo).
- `automacoes.html` — página com os 2 case studies de automação (reservas Pipper + cobrança estacionamento).
- `automacao-reservas.html` — case study isolado da automação de reservas (linkado pelo card "Pipper CRM" do portfólio).
- `en/index.html`, `en/automacoes.html`, `en/automacao-reservas.html` — **versão em inglês**,
  espelhando exatamente os mesmos componentes/classes CSS da versão PT, só com copy traduzida.
  Caminhos de asset usam `../` (estão uma pasta abaixo da raiz).
- `styles.css` / `script.js` — compartilhados por todas as páginas (PT e EN).
- `assets/` — imagens. `logo-simbolo.png` (ícone, usado no header/footer/favicon) e
  `logo-horizontal.png` (não usado mais no footer — foi trocado pelo ícone + texto real).
  `favicon.png` e `favicon.ico` precisam ser **quadrados** (Google ignora favicon não-quadrado
  nos resultados de busca). `og-image.jpg` é 1200×630 (tamanho ideal pra social share).
- `vercel.json` — headers de segurança (CSP, X-Frame-Options, etc.) + redirect do domínio antigo.
- `sitemap.xml` / `robots.txt` — mantidos manualmente, não gerados.
- `.tmp-serve.js` — servidor local simples pra preview (`node .tmp-serve.js`, porta 8734).
  Ignorado no git/deploy (`.gitignore` / `.vercelignore`).

## Convenções importantes (já causaram bugs antes — não repetir)

- **CSS Grid**: nunca usar `Nfr` puro em `grid-template-columns`. Sempre `minmax(0, Nfr)`.
  Um `1fr` puro tem `min-width: auto` implícito e um item com conteúdo largo (texto sem quebra,
  número grande) estoura o grid inteiro pra fora da tela no mobile. Isso já foi a causa raiz de
  vários bugs de "elemento vazando pra fora da tela" nesse projeto.
- **Texto que pode ser mais largo que o card** (nomes de portfólio, palavras longas em botões):
  usar `overflow-wrap: break-word` (não `word-break: break-word`, que quebra palavras curtas
  deixando letra sozinha numa linha) e, se possível, reduzir fonte/aumentar largura do card antes.
- **"Ink scoping"**: cards com fundo claro (`.bento-card`, `.package-card`, `.testimonial-card`,
  `.pill`, `.timeline__step`, `.mini-flow--big .mini-flow__step`, `.phone`) redefinem
  `--text`/`--text-muted` pra `--ink`/`--ink-muted` num seletor compartilhado no topo do CSS,
  pra herdar texto escuro automaticamente sem precisar sobrescrever cada seletor filho. Regras
  genéricas tipo `.bento-card p { color: ... }` têm especificidade maior que uma classe BEM
  isolada tipo `.bento-card__counter-text` — se uma cor não estiver aplicando, suspeitar de
  conflito de especificidade com essas regras genéricas antes de qualquer outra coisa.
- **Lenis é desabilitado em mobile/touch** (`pointer: coarse` ou `innerWidth <= 700`) — resolve
  bug de "scroll fantasma" no Safari iOS. Não reativar sem motivo forte.
- **Breakpoints usados**: 700px (mobile), 860px (tablet pequeno), 1080px (tablet/desktop pequeno).
- **Footer é "tradicional"** (sem card/caixa branca), ficando direto no fundo escuro com a fita
  animada (`.footer__ribbon`) atrás — não reintroduzir um wrapper `.footer-card` no footer.
- **Versão EN é espelho estrutural da PT**: mesmas classes CSS, mesmos IDs usados pelo `script.js`
  (`heroTitle`, `pathTitle`, `phoneAutomation`, `whatsappFloat`, `ribbonPath`, `header`, `nav`,
  `hamburger`). Ao editar conteúdo/seções da versão PT, replicar a mudança estrutural na EN
  (a copy em si não precisa ser idêntica, mas a estrutura/classes sim, senão a página quebra
  visualmente por falta de CSS — já aconteceu uma vez com uma versão EN antiga).
- **Botões "Voltar ao site"** (nas páginas de automação) usam `history.back()` via `onclick`
  com fallback de `href` — não trocar de volta pra um `href` simples pro `index.html`, isso
  perde a posição de scroll de quem veio do portfólio.

## Fluxo de trabalho

1. Editar os arquivos direto (sem build).
2. Pra conferir antes de publicar: `node .tmp-serve.js` e abrir `http://localhost:8734/`.
3. `git add` + `git commit` + `git push origin main` → deploy automático via Vercel.
4. Conferir no ar (`curl -sI` nos headers, ou abrir no navegador) antes de reportar como pronto.
