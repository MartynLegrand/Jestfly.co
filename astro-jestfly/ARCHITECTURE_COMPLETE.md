# 🏗️ JESTFLY - Arquitetura Completa e Roadmap Detalhado

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral)
2. [Estrutura de Diretórios Completa](#estrutura-de-diretórios)
3. [Módulos e Responsabilidades](#módulos-e-responsabilidades)
4. [Sistema de Conexões](#sistema-de-conexões)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Roadmap Detalhado por Fase](#roadmap-detalhado)
7. [Decisões de Arquitetura](#decisões-de-arquitetura)

---

## 🎯 Visão Geral

### Conceito Principal: Islands Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ASTRO STATIC HTML (SSR)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ React Island │  │ React Island │  │ React Island │     │
│  │  (Hydrated)  │  │  (Hydrated)  │  │  (Hydrated)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ← 90% HTML Estático  |  10% JavaScript Interativo →      │
└─────────────────────────────────────────────────────────────┘
```

**Benefícios:**
- 🚀 **Performance:** Apenas 10% do JavaScript do projeto React
- 🎯 **SEO:** Todo conteúdo renderizado no servidor
- ⚡ **TTI:** Time to Interactive < 2s
- 🌐 **Acessibilidade:** HTML funciona sem JavaScript

---

## 📁 Estrutura de Diretórios Completa

```
astro-jestfly/
│
├── src/
│   │
│   ├── pages/                          # 🌐 FILE-BASED ROUTING
│   │   ├── index.astro                 # Homepage (SSR)
│   │   ├── 404.astro                   # Error page
│   │   │
│   │   ├── auth/                       # Módulo: Autenticação
│   │   │   ├── login.astro             # SSR + React island
│   │   │   ├── register.astro          # SSR + React island
│   │   │   ├── reset-password.astro    # SSR + React island
│   │   │   └── verify-email.astro      # SSR + callback
│   │   │
│   │   ├── community/                  # Módulo: Comunidade
│   │   │   ├── index.astro             # Lista de posts (SSR)
│   │   │   ├── [postId].astro          # Post detalhe (SSR + islands)
│   │   │   ├── create.astro            # Criar post (React island)
│   │   │   ├── explore.astro           # Explorar (SSR + filtros island)
│   │   │   └── notifications.astro     # Notificações (island)
│   │   │
│   │   ├── profile/                    # Módulo: Perfil
│   │   │   ├── [username].astro        # Perfil público (SSR)
│   │   │   ├── edit.astro              # Editar perfil (island)
│   │   │   └── settings.astro          # Configurações (island)
│   │   │
│   │   ├── store/                      # Módulo: E-commerce
│   │   │   ├── index.astro             # Catálogo (SSR + SEO)
│   │   │   ├── [productId].astro       # Produto detalhe (SSR + SEO)
│   │   │   ├── cart.astro              # Carrinho (island persistente)
│   │   │   ├── checkout.astro          # Checkout (multi-step island)
│   │   │   └── orders/
│   │   │       ├── index.astro         # Lista pedidos (SSR)
│   │   │       └── [orderId].astro     # Pedido detalhe (SSR)
│   │   │
│   │   ├── wallet/                     # Módulo: JestCoin
│   │   │   ├── index.astro             # Dashboard (SSR + balance island)
│   │   │   ├── transfer.astro          # Transferir (island)
│   │   │   ├── history.astro           # Histórico (SSR + pagination)
│   │   │   ├── rewards.astro           # Recompensas (SSR + claim island)
│   │   │   └── staking.astro           # Staking (island)
│   │   │
│   │   ├── nft/                        # Módulo: NFT
│   │   │   ├── gallery.astro           # Galeria (SSR + lazy loading)
│   │   │   ├── [nftId].astro           # NFT detalhe (SSR + viewer island)
│   │   │   ├── mint.astro              # Mint NFT (island)
│   │   │   └── collections/
│   │   │       └── [collectionId].astro # Coleção (SSR)
│   │   │
│   │   ├── career/                     # Módulo: Career Planning
│   │   │   ├── index.astro             # Dashboard (SSR)
│   │   │   ├── canvas/
│   │   │   │   └── [projectId].astro   # Canvas (complex island)
│   │   │   └── projects.astro          # Lista projetos (SSR)
│   │   │
│   │   ├── demo/                       # Módulo: Demo Submission
│   │   │   ├── submit.astro            # Formulário (island)
│   │   │   ├── list.astro              # Lista demos (SSR)
│   │   │   └── [demoId].astro          # Demo player (island)
│   │   │
│   │   ├── streaming/                  # Módulo: Live Streaming
│   │   │   ├── hub.astro               # Hub de streams (SSR)
│   │   │   ├── [streamId].astro        # Stream player (island)
│   │   │   └── schedule.astro          # Agenda (SSR + calendar island)
│   │   │
│   │   ├── admin/                      # Módulo: Admin
│   │   │   ├── index.astro             # Dashboard admin (SSR)
│   │   │   ├── users.astro             # Gerenciar usuários
│   │   │   ├── content.astro           # Moderação
│   │   │   ├── orders.astro            # Gerenciar pedidos
│   │   │   └── analytics.astro         # Analytics (charts islands)
│   │   │
│   │   └── api/                        # 🔧 API ROUTES (Server Endpoints)
│   │       ├── auth/
│   │       │   ├── login.ts            # POST /api/auth/login
│   │       │   ├── register.ts         # POST /api/auth/register
│   │       │   └── logout.ts           # POST /api/auth/logout
│   │       ├── community/
│   │       │   ├── posts.ts            # GET/POST /api/community/posts
│   │       │   ├── comments.ts         # POST /api/community/comments
│   │       │   └── likes.ts            # POST /api/community/likes
│   │       ├── wallet/
│   │       │   ├── balance.ts          # GET /api/wallet/balance
│   │       │   └── transfer.ts         # POST /api/wallet/transfer
│   │       └── ...
│   │
│   ├── components/                     # 🧩 COMPONENTES
│   │   │
│   │   ├── ui/                         # UI Base (Astro + React)
│   │   │   ├── Button.astro            # Botão estático
│   │   │   ├── Card.astro              # Card estático
│   │   │   ├── Input.tsx               # Input interativo (React)
│   │   │   ├── Modal.tsx               # Modal (React)
│   │   │   ├── Tabs.tsx                # Tabs (React)
│   │   │   └── ...
│   │   │
│   │   ├── layouts/                    # Layouts
│   │   │   ├── Header.astro            # Header global
│   │   │   ├── Footer.astro            # Footer global
│   │   │   ├── Sidebar.astro           # Sidebar
│   │   │   └── MobileMenu.tsx          # Menu mobile (React island)
│   │   │
│   │   ├── auth/                       # 🔐 AUTH MODULE
│   │   │   ├── LoginForm.tsx           # React island
│   │   │   ├── RegisterForm.tsx        # React island
│   │   │   ├── SocialLogin.tsx         # React island
│   │   │   └── ProtectedRoute.tsx      # HOC para proteção
│   │   │
│   │   ├── community/                  # 💬 COMMUNITY MODULE
│   │   │   ├── PostCard.astro          # Static card (SSR)
│   │   │   ├── PostActions.tsx         # Like/share (React island)
│   │   │   ├── CommentForm.tsx         # Comentar (React island)
│   │   │   ├── CommentList.astro       # Lista (SSR)
│   │   │   ├── CreatePostModal.tsx     # Criar post (React island)
│   │   │   └── UserProfileCard.astro   # Profile card (SSR)
│   │   │
│   │   ├── store/                      # 🛒 STORE MODULE
│   │   │   ├── ProductCard.astro       # Produto card (SSR + SEO)
│   │   │   ├── ProductGallery.tsx      # Galeria (React island)
│   │   │   ├── AddToCartButton.tsx     # Add cart (React island)
│   │   │   ├── CartIcon.tsx            # Cart badge (React island)
│   │   │   ├── CartSidebar.tsx         # Cart drawer (React island)
│   │   │   ├── CheckoutForm.tsx        # Multi-step (React island)
│   │   │   └── ProductFilters.tsx      # Filtros (React island)
│   │   │
│   │   ├── wallet/                     # 💰 WALLET MODULE
│   │   │   ├── BalanceDisplay.tsx      # Balance (React island + realtime)
│   │   │   ├── TransferForm.tsx        # Transfer (React island)
│   │   │   ├── TransactionList.astro   # História (SSR)
│   │   │   ├── RewardCard.astro        # Reward card (SSR)
│   │   │   └── StakingPanel.tsx        # Staking (React island)
│   │   │
│   │   ├── nft/                        # 🎨 NFT MODULE
│   │   │   ├── NFTCard.astro           # NFT card (SSR)
│   │   │   ├── NFTViewer.tsx           # 3D viewer (React island)
│   │   │   ├── MintForm.tsx            # Mint (React island)
│   │   │   └── CollectionGrid.astro    # Grid (SSR + lazy loading)
│   │   │
│   │   ├── career/                     # 📊 CAREER MODULE
│   │   │   ├── Canvas.tsx              # ReactFlow canvas (complex island)
│   │   │   ├── CanvasToolbar.tsx       # Toolbar (React island)
│   │   │   ├── NodeTypes/              # Custom nodes
│   │   │   │   ├── TaskNode.tsx
│   │   │   │   ├── MilestoneNode.tsx
│   │   │   │   └── NoteNode.tsx
│   │   │   ├── Timeline.tsx            # Timeline (React island)
│   │   │   └── ProjectCard.astro       # Project card (SSR)
│   │   │
│   │   ├── demo/                       # 🎵 DEMO MODULE
│   │   │   ├── AudioPlayer.tsx         # Player (React island)
│   │   │   ├── UploadForm.tsx          # Upload (React island)
│   │   │   ├── DemoCard.astro          # Demo card (SSR)
│   │   │   └── FeedbackForm.tsx        # Feedback (React island)
│   │   │
│   │   ├── streaming/                  # 📹 STREAMING MODULE
│   │   │   ├── VideoPlayer.tsx         # HLS player (React island)
│   │   │   ├── ChatInterface.tsx       # Chat (React island + realtime)
│   │   │   ├── DonationPanel.tsx       # Donations (React island)
│   │   │   └── StreamGrid.astro        # Stream grid (SSR)
│   │   │
│   │   └── admin/                      # 👨‍💼 ADMIN MODULE
│   │       ├── UserTable.tsx           # User management (React island)
│   │       ├── ContentModeration.tsx   # Moderação (React island)
│   │       ├── AnalyticsCharts.tsx     # Charts (React island)
│   │       └── OrderManagement.tsx     # Orders (React island)
│   │
│   ├── layouts/                        # 📐 LAYOUTS
│   │   ├── BaseLayout.astro            # Base HTML + head
│   │   ├── MainLayout.astro            # Header + Footer + slot
│   │   ├── AuthLayout.astro            # Layout para auth pages
│   │   ├── AdminLayout.astro           # Layout para admin
│   │   └── DashboardLayout.astro       # Layout para dashboards
│   │
│   ├── lib/                            # 📚 LIBRARIES
│   │   │
│   │   ├── supabase/                   # Supabase clients
│   │   │   ├── client.ts               # Browser client
│   │   │   ├── server.ts               # Server client (SSR)
│   │   │   └── types.ts                # Database types
│   │   │
│   │   ├── services/                   # Business logic
│   │   │   ├── auth.service.ts         # Auth operations
│   │   │   ├── post.service.ts         # Post CRUD
│   │   │   ├── wallet.service.ts       # Wallet operations
│   │   │   ├── nft.service.ts          # NFT operations
│   │   │   ├── store.service.ts        # Store operations
│   │   │   └── ...
│   │   │
│   │   ├── stores/                     # Client-side state (Nanostores)
│   │   │   ├── auth.store.ts           # Auth state
│   │   │   ├── cart.store.ts           # Shopping cart
│   │   │   ├── wallet.store.ts         # Wallet balance
│   │   │   └── theme.store.ts          # Theme state
│   │   │
│   │   ├── utils/                      # Utilities
│   │   │   ├── cn.ts                   # Class name utility
│   │   │   ├── format.ts               # Formatters
│   │   │   ├── validation.ts           # Validators
│   │   │   └── constants.ts            # Constants
│   │   │
│   │   └── hooks/                      # React hooks (para islands)
│   │       ├── useAuth.ts              # Auth hook
│   │       ├── useWallet.ts            # Wallet hook
│   │       ├── useCart.ts              # Cart hook
│   │       └── ...
│   │
│   ├── middleware/                     # 🛡️ MIDDLEWARE
│   │   ├── auth.ts                     # Authentication check
│   │   ├── admin.ts                    # Admin role check
│   │   └── ratelimit.ts                # Rate limiting
│   │
│   ├── types/                          # 📝 TYPES
│   │   ├── auth.ts                     # Auth types
│   │   ├── community.ts                # Community types
│   │   ├── store.ts                    # Store types
│   │   ├── wallet.ts                   # Wallet types
│   │   ├── nft.ts                      # NFT types
│   │   └── ...
│   │
│   ├── config/                         # ⚙️ CONFIG
│   │   ├── site.ts                     # Site metadata
│   │   ├── navigation.ts               # Nav structure
│   │   └── features.ts                 # Feature flags
│   │
│   └── styles/                         # 🎨 STYLES
│       ├── global.css                  # Global styles + dark mode
│       └── animations.css              # Custom animations
│
├── public/                             # 🌐 STATIC ASSETS
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── supabase/                           # 🗄️ SUPABASE
│   ├── migrations/                     # Database migrations
│   └── functions/                      # Edge functions
│       ├── create-payment-intent/
│       ├── confirm-payment/
│       ├── webhook-stripe/
│       └── ...
│
└── astro.config.mjs                    # Astro config
```

---

## 🔧 Módulos e Responsabilidades

### 1. 🔐 Módulo de Autenticação

**Responsabilidade:** Gerenciar login, registro, sessões e permissões

**Componentes:**
```
auth/
├── LoginForm.tsx           → Form com email/senha
├── RegisterForm.tsx        → Form de cadastro
├── SocialLogin.tsx         → Login OAuth (Google, etc)
├── ForgotPassword.tsx      → Recuperação de senha
└── ProtectedRoute.tsx      → HOC para rotas protegidas
```

**Fluxo:**
```
User Input → LoginForm (island) → API Route → Supabase Auth
                                     ↓
                              Set Cookie Session
                                     ↓
                              Redirect to Dashboard
```

**Banco de Dados:**
- Tabela: `auth.users` (Supabase built-in)
- Tabela: `profiles` (custom data)

---

### 2. 💬 Módulo de Comunidade

**Responsabilidade:** Posts, comentários, likes, seguir usuários

**Componentes:**
```
community/
├── PostCard.astro          → Card estático (SSR)
├── PostActions.tsx         → Like/Share (island)
├── CommentForm.tsx         → Formulário (island)
├── CommentList.astro       → Lista (SSR)
├── CreatePostModal.tsx     → Modal criar (island)
└── UserProfileCard.astro   → Profile (SSR)
```

**Fluxo de Criar Post:**
```
User → CreatePostModal → Validate → API /api/community/posts
                                          ↓
                                    Insert to DB
                                          ↓
                                    Revalidate page
                                          ↓
                                    Show new post
```

**Banco de Dados:**
```sql
posts (id, user_id, content, created_at)
comments (id, post_id, user_id, content)
likes (user_id, post_id)
follows (follower_id, following_id)
```

---

### 3. 🛒 Módulo de E-commerce

**Responsabilidade:** Catálogo, carrinho, checkout, pedidos

**Componentes:**
```
store/
├── ProductCard.astro       → Card produto (SSR + SEO)
├── ProductGallery.tsx      → Galeria imagens (island)
├── AddToCartButton.tsx     → Botão add (island)
├── CartSidebar.tsx         → Carrinho drawer (island)
├── CheckoutForm.tsx        → Checkout multi-step (island)
└── OrderHistory.astro      → Lista pedidos (SSR)
```

**Fluxo de Compra:**
```
Browse Products (SSR) → Add to Cart (island + localStorage)
                              ↓
                        View Cart → Checkout Form (island)
                                          ↓
                                    Payment Intent
                                          ↓
                                    Confirm Payment
                                          ↓
                                    Create Order
                                          ↓
                                    Clear Cart
                                          ↓
                                    Redirect to Order Page
```

**Banco de Dados:**
```sql
products (id, name, price, images, stock)
cart_items (user_id, product_id, quantity) -- temp
orders (id, user_id, total, status)
order_items (order_id, product_id, quantity, price)
```

---

### 4. 💰 Módulo JestCoin (Wallet)

**Responsabilidade:** Saldo, transferências, recompensas, staking

**Componentes:**
```
wallet/
├── BalanceDisplay.tsx      → Balance (island + realtime)
├── TransferForm.tsx        → Form transfer (island)
├── TransactionList.astro   → História (SSR + pagination)
├── RewardCard.astro        → Reward (SSR)
└── StakingPanel.tsx        → Staking (island)
```

**Fluxo de Transferência:**
```
User → TransferForm (island) → Validate balance
                                    ↓
                              API /api/wallet/transfer
                                    ↓
                              Database transaction:
                                - Deduct from sender
                                - Add to receiver
                                - Create transaction record
                                    ↓
                              Update UI (realtime)
```

**Banco de Dados:**
```sql
wallets (user_id, balance, locked_balance)
transactions (id, from_user, to_user, amount, type, created_at)
rewards (id, user_id, amount, reason, claimed)
staking (id, user_id, amount, start_date, end_date)
```

---

### 5. 🎨 Módulo NFT

**Responsabilidade:** Galeria, visualização, mint, compra/venda

**Componentes:**
```
nft/
├── NFTCard.astro           → Card NFT (SSR)
├── NFTViewer.tsx           → 3D viewer (React Three Fiber island)
├── MintForm.tsx            → Form mint (island)
├── CollectionGrid.astro    → Grid coleções (SSR)
└── BuySellModal.tsx        → Modal buy/sell (island)
```

**Fluxo de Mint:**
```
User → MintForm → Upload image → Supabase Storage
                        ↓
                  Generate metadata
                        ↓
                  Create NFT record
                        ↓
                  Mint on blockchain (mock)
                        ↓
                  Show NFT in gallery
```

**Banco de Dados:**
```sql
nfts (id, owner_id, metadata, image_url, token_id)
collections (id, name, description, creator_id)
nft_transactions (nft_id, from_user, to_user, price)
```

---

### 6. 📊 Módulo Career Canvas

**Responsabilidade:** Planejamento visual de carreira com nodes

**Componentes:**
```
career/
├── Canvas.tsx              → ReactFlow canvas (complex island)
├── CanvasToolbar.tsx       → Toolbar (island)
├── NodeTypes/
│   ├── TaskNode.tsx        → Node de tarefa
│   ├── MilestoneNode.tsx   → Node de milestone
│   └── NoteNode.tsx        → Node de nota
├── Timeline.tsx            → Timeline (island)
└── ProjectCard.astro       → Card projeto (SSR)
```

**Fluxo:**
```
User → Create project → Open canvas (ReactFlow island)
                              ↓
                        Add nodes (drag & drop)
                              ↓
                        Connect nodes (edges)
                              ↓
                        Auto-save to DB (debounced)
                              ↓
                        Generate timeline view
```

**Banco de Dados:**
```sql
projects (id, user_id, name, description)
nodes (id, project_id, type, position, data)
edges (id, project_id, source, target)
```

---

### 7. 🎵 Módulo Demo Submission

**Responsabilidade:** Upload de demos, player, feedback

**Componentes:**
```
demo/
├── UploadForm.tsx          → Form upload (island)
├── AudioPlayer.tsx         → Player com waveform (island)
├── DemoCard.astro          → Card demo (SSR)
└── FeedbackForm.tsx        → Form feedback (island)
```

**Fluxo:**
```
Artist → Upload audio file → Supabase Storage
                                  ↓
                            Extract metadata
                                  ↓
                            Create demo record
                                  ↓
                            Status: pending approval
                                  ↓
                            Admin approves → published
                                  ↓
                            Show in public list
```

**Banco de Dados:**
```sql
demos (id, artist_id, title, audio_url, status, created_at)
demo_feedback (id, demo_id, user_id, rating, comment)
```

---

### 8. 📹 Módulo Streaming

**Responsabilidade:** Live streams, chat, donations

**Componentes:**
```
streaming/
├── VideoPlayer.tsx         → HLS player (island)
├── ChatInterface.tsx       → Chat realtime (island)
├── DonationPanel.tsx       → Donations (island)
└── StreamGrid.astro        → Grid de streams (SSR)
```

**Fluxo:**
```
Streamer → Start stream → Generate HLS URL
                                ↓
                          Update stream status: live
                                ↓
Viewer → Watch stream → VideoPlayer (island)
              ↓
        Send chat messages → Realtime DB
              ↓
        Send donations → Payment processing
```

**Banco de Dados:**
```sql
streams (id, streamer_id, title, status, viewers, hls_url)
chat_messages (id, stream_id, user_id, message, created_at)
donations (id, stream_id, user_id, amount)
```

---

### 9. 👨‍💼 Módulo Admin

**Responsabilidade:** Gerenciamento de usuários, conteúdo, pedidos

**Componentes:**
```
admin/
├── UserTable.tsx           → Tabela users (island)
├── ContentModeration.tsx   → Moderação (island)
├── OrderManagement.tsx     → Gerenciar pedidos (island)
└── AnalyticsCharts.tsx     → Charts (island)
```

**Fluxo:**
```
Admin → Login → Check role = admin
                      ↓
                Access admin dashboard
                      ↓
                View stats (SSR)
                      ↓
                Moderate content → Update DB
                      ↓
                Manage users → Update DB
```

**Banco de Dados:**
```sql
-- Reusa as mesmas tabelas + admin checks
-- RLS policies verificam role = 'admin'
```

---

## 🔄 Sistema de Conexões

### Camadas da Aplicação

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Astro Pages  │  │ React Islands│  │ Nano Stores  │  │
│  │    (SSR)     │  │  (Hydrated)  │  │  (State)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  API Routes     │
                    │  /api/*         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Services      │
                    │  (Business)     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐   ┌────────▼────────┐   ┌────▼─────┐
    │ Supabase  │   │ Supabase Edge   │   │ External │
    │ Database  │   │   Functions     │   │   APIs   │
    └───────────┘   └─────────────────┘   └──────────┘
```

### Fluxo de Dados

#### 1. Leitura (SSR - Server-Side)
```
User Request
    ↓
Astro Page (.astro)
    ↓
Service Layer (lib/services/*.service.ts)
    ↓
Supabase Server Client (lib/supabase/server.ts)
    ↓
Database Query
    ↓
Return Data to Page
    ↓
Render HTML (SSR)
    ↓
Send to Browser (HTML estático)
```

#### 2. Escrita/Interação (Client-Side)
```
User Action
    ↓
React Island Component (.tsx)
    ↓
API Route (/api/*)
    ↓
Service Layer
    ↓
Supabase Client
    ↓
Database Mutation
    ↓
Return Response
    ↓
Update Island State
    ↓
(Optional) Revalidate SSR data
```

#### 3. Realtime (WebSocket)
```
Database Change
    ↓
Supabase Realtime
    ↓
Client Subscription (in React island)
    ↓
Update Component State
    ↓
Re-render Island
```

### Comunicação entre Islands

**Usando Nano Stores (Shared State):**

```typescript
// lib/stores/cart.store.ts
import { atom } from 'nanostores';

export const cartStore = atom({
  items: [],
  total: 0
});

// Component A (AddToCartButton.tsx)
import { useStore } from '@nanostores/react';
import { cartStore } from '@/lib/stores/cart.store';

function AddToCartButton() {
  const cart = useStore(cartStore);

  const addItem = () => {
    cartStore.set({
      ...cart,
      items: [...cart.items, newItem]
    });
  };
}

// Component B (CartIcon.tsx)
import { useStore } from '@nanostores/react';
import { cartStore } from '@/lib/stores/cart.store';

function CartIcon() {
  const cart = useStore(cartStore);
  return <Badge>{cart.items.length}</Badge>;
}
```

---

## 📊 Roadmap Detalhado por Fase

### FASE 1: Foundation ✅ (COMPLETA)
**Tempo:** 2 dias
**Status:** 100% completo

```
✅ Setup Astro + React
✅ Configure Tailwind CSS v4
✅ Setup Supabase clients
✅ Create base layouts
✅ Create placeholder pages
✅ Verify build works
```

---

### FASE 2: Authentication 🔐
**Tempo:** 3-4 dias
**Prioridade:** ALTA

**Tarefas:**
1. Criar middleware de autenticação
2. Implementar LoginForm (React island)
3. Implementar RegisterForm (React island)
4. Setup de cookies e sessões
5. Criar ProtectedRoute wrapper
6. Página de perfil com SSR
7. Password recovery flow
8. Role-based access control

**Arquivos a Criar:**
```
src/
├── middleware/auth.ts
├── pages/
│   └── auth/
│       ├── login.astro
│       ├── register.astro
│       └── reset-password.astro
├── components/auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProtectedRoute.tsx
└── lib/
    ├── services/auth.service.ts
    └── stores/auth.store.ts
```

**Conexões:**
```
LoginForm → API /api/auth/login → auth.service.ts → Supabase Auth
     ↓
Set cookie session → Middleware verifica cookie → Allow access
```

---

### FASE 3: Community 💬
**Tempo:** 5-6 dias
**Prioridade:** ALTA

**Tarefas:**
1. Página de posts (SSR com pagination)
2. PostCard component (Astro)
3. PostActions component (React island)
4. Sistema de comentários
5. Sistema de likes
6. Criar post (modal island)
7. Perfis de usuário
8. Follow/unfollow

**Arquivos a Criar:**
```
src/
├── pages/community/
│   ├── index.astro
│   ├── [postId].astro
│   └── create.astro
├── components/community/
│   ├── PostCard.astro
│   ├── PostActions.tsx
│   ├── CommentForm.tsx
│   ├── CommentList.astro
│   └── CreatePostModal.tsx
└── lib/services/
    ├── post.service.ts
    ├── comment.service.ts
    └── like.service.ts
```

**Migrações DB:**
```sql
CREATE TABLE posts (...);
CREATE TABLE comments (...);
CREATE TABLE likes (...);
CREATE TABLE follows (...);
```

---

### FASE 4: Demo Submission 🎵
**Tempo:** 4-5 dias
**Prioridade:** ALTA

**Tarefas:**
1. Form de upload (React island)
2. Audio player com waveform
3. Lista de demos (SSR)
4. Sistema de feedback
5. Aprovação admin
6. Categorias de demos

**Arquivos a Criar:**
```
src/
├── pages/demo/
│   ├── submit.astro
│   ├── list.astro
│   └── [demoId].astro
├── components/demo/
│   ├── UploadForm.tsx
│   ├── AudioPlayer.tsx
│   ├── DemoCard.astro
│   └── FeedbackForm.tsx
└── lib/services/
    └── demo.service.ts
```

---

### FASE 5: JestCoin Wallet 💰
**Tempo:** 5-6 dias
**Prioridade:** ALTA

**Tarefas:**
1. Dashboard wallet (SSR)
2. Balance display (realtime island)
3. Transfer form
4. Histórico de transações
5. Sistema de recompensas
6. Staking

**Arquivos a Criar:**
```
src/
├── pages/wallet/
│   ├── index.astro
│   ├── transfer.astro
│   └── history.astro
├── components/wallet/
│   ├── BalanceDisplay.tsx
│   ├── TransferForm.tsx
│   ├── TransactionList.astro
│   └── StakingPanel.tsx
└── lib/services/
    └── wallet.service.ts
```

**Migrações DB:**
```sql
CREATE TABLE wallets (...);
CREATE TABLE transactions (...);
CREATE TABLE rewards (...);
```

---

### FASE 6: E-commerce Store 🛒
**Tempo:** 6-7 dias
**Prioridade:** MÉDIA

**Tarefas:**
1. Catálogo de produtos (SSR + SEO)
2. Página de produto (SSR + SEO)
3. Shopping cart (persistent island)
4. Checkout flow (multi-step)
5. Payment integration
6. Order history
7. Product reviews

**Arquivos a Criar:**
```
src/
├── pages/store/
│   ├── index.astro
│   ├── [productId].astro
│   ├── cart.astro
│   └── checkout.astro
├── components/store/
│   ├── ProductCard.astro
│   ├── ProductGallery.tsx
│   ├── AddToCartButton.tsx
│   ├── CartSidebar.tsx
│   └── CheckoutForm.tsx
└── lib/
    ├── services/store.service.ts
    └── stores/cart.store.ts
```

---

### FASE 7: NFT Gallery 🎨
**Tempo:** 5-6 dias
**Prioridade:** MÉDIA

**Tarefas:**
1. NFT gallery (SSR + lazy loading)
2. NFT viewer 3D (React Three Fiber)
3. Mint form
4. Collections
5. Buy/sell system

**Arquivos a Criar:**
```
src/
├── pages/nft/
│   ├── gallery.astro
│   ├── [nftId].astro
│   └── mint.astro
├── components/nft/
│   ├── NFTCard.astro
│   ├── NFTViewer.tsx
│   ├── MintForm.tsx
│   └── CollectionGrid.astro
└── lib/services/
    └── nft.service.ts
```

---

### FASE 8: Career Canvas 📊
**Tempo:** 7-8 dias
**Prioridade:** MÉDIA

**Tarefas:**
1. Dashboard de projetos
2. Canvas ReactFlow (complex island)
3. Custom nodes
4. Timeline visualizer
5. Auto-save
6. Google Calendar integration

**Arquivos a Criar:**
```
src/
├── pages/career/
│   ├── index.astro
│   └── canvas/[projectId].astro
├── components/career/
│   ├── Canvas.tsx
│   ├── CanvasToolbar.tsx
│   ├── NodeTypes/
│   │   ├── TaskNode.tsx
│   │   ├── MilestoneNode.tsx
│   │   └── NoteNode.tsx
│   └── Timeline.tsx
└── lib/services/
    └── canvas.service.ts
```

---

### FASE 9: Streaming 📹
**Tempo:** 6-7 dias
**Prioridade:** BAIXA

**Tarefas:**
1. Stream hub
2. HLS video player
3. Realtime chat
4. Donation system
5. Event scheduling

**Arquivos a Criar:**
```
src/
├── pages/streaming/
│   ├── hub.astro
│   ├── [streamId].astro
│   └── schedule.astro
├── components/streaming/
│   ├── VideoPlayer.tsx
│   ├── ChatInterface.tsx
│   └── DonationPanel.tsx
└── lib/services/
    └── streaming.service.ts
```

---

### FASE 10: Admin Dashboard 👨‍💼
**Tempo:** 5-6 dias
**Prioridade:** MÉDIA

**Tarefas:**
1. Admin layout
2. User management
3. Content moderation
4. Order management
5. Analytics

**Arquivos a Criar:**
```
src/
├── pages/admin/
│   ├── index.astro
│   ├── users.astro
│   ├── content.astro
│   └── orders.astro
└── components/admin/
    ├── UserTable.tsx
    ├── ContentModeration.tsx
    └── OrderManagement.tsx
```

---

### FASE 11: Analytics 📈
**Tempo:** 4-5 dias
**Prioridade:** BAIXA

**Tarefas:**
1. Tracking system
2. Charts components
3. Export features
4. Real-time metrics

---

### FASE 12: Advanced Features ⚡
**Tempo:** 6-7 dias
**Prioridade:** BAIXA

**Tarefas:**
1. PWA setup
2. Push notifications
3. Offline mode
4. Email system
5. In-app messaging

---

### FASE 13: Testing & Deploy 🚀
**Tempo:** 5-6 dias
**Prioridade:** ALTA

**Tarefas:**
1. Unit tests
2. E2E tests (Playwright)
3. Performance testing
4. CI/CD pipeline
5. Production deploy

---

## 🎯 Decisões de Arquitetura

### 1. Quando Usar SSR vs Islands?

**Use SSR (Astro components):**
- ✅ Conteúdo estático (text, cards)
- ✅ SEO-critical pages
- ✅ Listagens de dados
- ✅ Blogs, articles, landing pages

**Use Islands (React components):**
- ✅ Forms com validação
- ✅ Modals e dialogs
- ✅ Tabs, accordions
- ✅ Realtime features
- ✅ Complex interactions

### 2. Hydration Strategies

```astro
<!-- Load immediately -->
<CartIcon client:load />

<!-- Load when visible -->
<ProductGallery client:visible />

<!-- Load when idle -->
<Newsletter client:idle />

<!-- Only client-side -->
<Canvas client:only="react" />
```

### 3. State Management

```
Global State: Nano Stores (cart, auth, theme)
Local State: React useState/useReducer
Server State: TanStack Query
Form State: React Hook Form
```

### 4. Performance Budget

```
Target Metrics:
- Lighthouse: 100/100
- FCP: < 1s
- TTI: < 2s
- Bundle: < 100KB initial JS
```

---

## 📈 Timeline Total

```
FASE 1:  2 dias   ✅ COMPLETA
FASE 2:  4 dias   🔐 Auth
FASE 3:  6 dias   💬 Community
FASE 4:  5 dias   🎵 Demo
FASE 5:  6 dias   💰 Wallet
FASE 6:  7 dias   🛒 Store
FASE 7:  6 dias   🎨 NFT
FASE 8:  8 dias   📊 Career
FASE 9:  7 dias   📹 Streaming
FASE 10: 6 dias   👨‍💼 Admin
FASE 11: 5 dias   📈 Analytics
FASE 12: 7 dias   ⚡ Advanced
FASE 13: 6 dias   🚀 Deploy
─────────────────
TOTAL:  75 dias (~3.5 meses)
```

---

## ✅ Checklist de Qualidade

Para cada módulo desenvolvido:

- [ ] Funciona sem JavaScript (progressive enhancement)
- [ ] Performance Lighthouse > 95
- [ ] Acessibilidade WCAG AA
- [ ] SEO metadata completo
- [ ] Dark mode implementado
- [ ] Responsive (mobile-first)
- [ ] Error handling
- [ ] Loading states
- [ ] TypeScript types
- [ ] RLS policies no Supabase
- [ ] Testes unitários
- [ ] Documentação

---

**Última Atualização:** 16 de Novembro de 2024
**Versão:** 1.0
**Status:** Fase 1 Completa, Fase 2 Pronta para Iniciar
