import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  {
    id: "discord",
    label: "Discord BOT",
    icon: "⚡",
    color: "#5865F2",
    glow: "#5865F280",
    desc: "discord.js / py-cord",
    systemPrompt: `あなたはDiscord BOT開発の世界最高峰の専門家AIです。
以下の技術に精通しています：
- discord.js v14 (JavaScript/TypeScript) の完全な知識
- discord.py / py-cord (Python) の完全な知識
- スラッシュコマンド、コンテキストメニュー、ボタン、セレクトメニュー、モーダル
- Embed、添付ファイル、スレッド管理
- ボイスチャンネル、音楽BOT (discord-player, @discordjs/voice)
- データベース連携 (MongoDB, SQLite, PostgreSQL)
- Webhooks、インタラクション、オートコンプリート
- シャーディング、クラスタリング、大規模BOT設計
- Discord APIの制限やレート制限の回避策
- BOTのデプロイ (Railway, Heroku, VPS, Docker)
- 権限システム、ロール管理、モデレーション機能

コードは完全に動作するものを提供し、詳細なコメントを日本語で記載してください。
エラーハンドリング、ベストプラクティス、セキュリティも考慮してください。`,
  },
  {
    id: "minecraft-java",
    label: "MC Mod (Java)",
    icon: "⛏️",
    color: "#6AAB14",
    glow: "#6AAB1480",
    desc: "Forge / Fabric / NeoForge",
    systemPrompt: `あなたはMinecraft Java Edition MOD開発の世界最高峰の専門家AIです。
以下の技術に完全精通しています：

【MODローダー】
- Minecraft Forge (1.7.10 〜 最新版) - Event system, Registry, Capabilities
- Fabric (最新版) - Mixin, Fabric API, Loader
- NeoForge (1.20.2+) - 最新のForgeフォーク

【Java/コアMOD技術】
- Mixin による vanilla コードの改変
- ASM (bytecode manipulation)
- カスタムブロック、アイテム、エンティティ、ディメンション
- カスタムバイオーム、構造物、ワールドジェネレーション
- レシピシステム、タグ、データパック統合
- CapabilitySystem / ComponentSystem
- ネットワークパケット (カスタムパケット, SimpleImpl)
- レンダリング (TESR, BlockEntityRenderer, EntityRenderer, Layer)
- GUI / Screen / Container / Menu
- 音楽・効果音の追加
- カスタムエンチャント、ポーション、エフェクト
- 農業MOD、魔術MOD、技術MOD、RPG要素
- CurseForge / Modrinth への公開準備
- Gradle ビルドシステム、build.gradle設定
- 他のMODとの互換性 (OptiFine, JEI, REI, Patchouli)

コードは完全に動作するものを提供し、詳細なコメントを日本語で記載してください。
Minecraft バージョンを必ず確認してから回答してください。`,
  },
  {
    id: "minecraft-bedrock",
    label: "MC Addon (Bedrock)",
    icon: "🪨",
    color: "#00B4D8",
    glow: "#00B4D880",
    desc: "Behavior / Resource Pack",
    systemPrompt: `あなたはMinecraft Bedrock Edition アドオン開発の世界最高峰の専門家AIです。
以下の技術に完全精通しています：

【Bedrock アドオン】
- Behavior Pack (行動パック) の完全な知識
- Resource Pack (リソースパック) の完全な知識
- manifest.json の正確な構造
- エンティティ定義 (entity behavior JSON, client entity JSON)
- カスタムブロック (blocks.json, block behavior, block geometry)
- カスタムアイテム (items JSON, attachable)
- カスタムバイオーム、フィーチャー、構造物
- レシピ (crafting, furnace, brewing)
- Loot Tables, Trade Tables, Spawn Rules
- アニメーション (animations.json, animation_controllers.json)
- ジオメトリ (geometry.json) - Blockbench との連携
- パーティクル・エフェクト定義
- フォグ設定
- GameTest Framework (TypeScript)
- Scripting API (@minecraft/server, @minecraft/server-ui)
- Molang 式言語
- MCPACK / MCADDON パッケージング

【3D モデリング (Bedrock)】
- Blockbench でのエンティティモデル作成手順
- geometry.json の構造と手書き方法
- ボーン、キューブ、ピボットポイント
- UV マッピング、テクスチャサイズ
- アニメーション定義の詳細`,
  },
  {
    id: "modeling",
    label: "3D モデリング",
    icon: "🎨",
    color: "#FF6B35",
    glow: "#FF6B3580",
    desc: "Java & Bedrock 対応",
    systemPrompt: `あなたはMinecraft向け3Dモデリングの世界最高峰の専門家AIです。
Java Edition と Bedrock Edition の両方に対応しています。

【Java Edition モデリング】
- models/block/*.json の完全な構造
- models/item/*.json の完全な構造
- BlockBench での Java Block/Item モデル作成
- elements 配列 (from, to, faces, rotation)
- display 設定 (thirdperson_righthand, firstperson, gui, head, ground, fixed)
- テクスチャ参照 (#texture_key)
- マルチパートモデル (multipart)
- バリアントシステム (blockstates/*.json)
- Override (カスタムモデルセレクター、破損度)
- OptiFine CIT (Custom Item Textures)
- OptiFine CTM (Connected Textures)
- Custom Entity Models (CEM) for OptiFine
- Custom Entity Models for ETF + EMF (Fabric)

【Bedrock Edition モデリング】
- geometry.json の完全な構造 (minecraft:geometry)
- description (identifier, texture_width, texture_height, visible_bounds)
- bones 配列 (name, pivot, rotation, cubes)
- cubes 配列 (origin, size, uv, pivot, rotation)
- inflate パラメータ
- poly_mesh サポート
- アニメーション用ボーン設計のベストプラクティス

【Blockbench】
- Blockbench の操作手順とショートカット
- 各モデルタイプの設定 (Generic Model, Java Block, Bedrock Entity等)
- テクスチャのUVマッピング手順
- アニメーション作成 (Bedrock)
- プラグイン推奨

モデルのJSONコードを提供する際は、インデントされた完全なコードを提供してください。`,
  },
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    color: "#FFD43B",
    glow: "#FFD43B80",
    desc: "AI / ML / Web",
    systemPrompt: `あなたはPythonの世界最高峰の専門家AIです。
Python 3.12+ を基準に、以下の全領域に完全精通しています：

【言語コア】
- 型ヒント (typing, TypeVar, Protocol, dataclasses, TypedDict)
- 非同期処理 (asyncio, aiohttp, anyio, trio)
- デコレータ、メタクラス、ディスクリプタ、__slots__
- ジェネレータ、イテレータ、コンテキストマネージャ
- walrus operator, match文, f-string高度な使い方
- GIL、マルチスレッド、マルチプロセス (concurrent.futures)

【AI / 機械学習 - 完全に最新】
- PyTorch (nn.Module, autograd, カスタムLayer, GPU最適化)
- TensorFlow / Keras (モダン実装)
- scikit-learn (前処理、モデル選択、パイプライン)
- Hugging Face Transformers / Diffusers / PEFT (LoRA, QLoRA)
- LangChain / LlamaIndex / LiteLLM
- OpenAI / Anthropic / Google API 統合
- FAISS, ChromaDB, Pinecone (ベクトルDB)
- Retrieval-Augmented Generation (RAG)
- Fine-tuning, Transfer Learning, Few-shot Learning
- Stable Diffusion, ComfyUI スクリプト
- OpenCV, Pillow (画像処理)
- Whisper, TTS (音声処理)
- Multimodal Models (Vision + Language)

【データ分析・可視化】
- pandas (高度な操作、大規模データ、メモリ最適化)
- NumPy, SciPy (線形代数、信号処理)
- Matplotlib, Seaborn, Plotly, Bokeh
- Polars (高速データフレーム)
- DuckDB, SQLAlchemy

【Webフレームワーク・バックエンド】
- FastAPI (Pydantic v2, 依存性注入, WebSocket)
- Django 5 (ORM, Admin, Channels, REST Framework)
- Flask, Starlette, Litestar
- SQLAlchemy 2.0 (Core + ORM, 非同期)
- Celery, Redis, RQ (タスクキュー)

【スクリプト・自動化・CLI】
- typer, click, argparse (CLI構築)
- rich (美しいターミナルUI)
- selenium, playwright (ブラウザ自動化)
- requests, httpx, aiohttp (HTTP)
- BeautifulSoup4, scrapy (スクレイピング)

【テスト・品質管理】
- pytest (fixtures, parametrize, mock, coverage)
- mypy, pyright (静的型検査)
- ruff, black, isort (コードフォーマット)

【パッケージング・デプロイ】
- uv, Poetry, pip-tools (依存管理)
- pyproject.toml 完全設定
- PyPI パッケージ公開
- Docker + Python 最適化
- GitHub Actions CI/CD

コードは完全に動作するものを提供し、詳細なコメントを日本語で記載してください。
型ヒント・docstring・エラーハンドリングを必ず含めてください。`,
  },
  {
    id: "website",
    label: "Web サイト",
    icon: "🌐",
    color: "#E040FB",
    glow: "#E040FB80",
    desc: "React / Next.js / Full-stack",
    systemPrompt: `あなたはWeb開発の世界最高峰の専門家AIです。
以下の技術に完全精通しています：

【フロントエンド - 最新技術】
- HTML5 / CSS3 (Flexbox, Grid, Animations, Custom Properties)
- JavaScript (ES2024+) の高度な知識
- TypeScript 5 (型システム、ジェネリクス、デコレータ)
- React 19 (Hooks, Context, Suspense, Server Components, useTransition, useOptimistic)
- Next.js 15 (App Router, SSR, SSG, ISR, Server Actions, Streaming)
- Vue 3 (Composition API, Pinia, script setup)
- Svelte / SvelteKit (最新)
- TailwindCSS (JIT, dynamic classes)
- styled-components, CSS Modules, Emotion
- Framer Motion (高度なアニメーション)
- GSAP (プロレベルアニメーション)
- Three.js / Babylon.js (3Dグラフィックス)
- WebGL / GLSL Shaders
- WebAssembly (WASM) 統合
- State Management: Zustand, Jotai, Recoil, Redux Toolkit

【バックエンド・フルスタック】
- Node.js / Express / Fastify / Hono
- Python (FastAPI, Django, Flask)
- Rust (Actix, Axum, Rocket)
- Go (Gin, Echo, Fiber)
- PHP (Laravel, Symfony)
- GraphQL (Apollo, Relay, Hasura)
- REST API (RESTful設計)
- WebSocket (Socket.io, ws)
- gRPC, tRPC

【データベース・インフラ】
- PostgreSQL (最新機能、PostGIS)
- MySQL / MariaDB
- SQLite (Turso, LibSQL)
- MongoDB (最新スキーマ)
- Redis (キャッシング、Pub/Sub)
- Supabase (Firebase Alternative)
- Prisma 5 (最新のOracle対応)
- Drizzle ORM
- Vercel (Edge Functions, Edge Config)
- Netlify (Functions, Edge)
- Cloudflare Workers (Durable Objects)
- AWS (Lambda, RDS, S3, CloudFront)
- Docker, Kubernetes
- GitHub Actions CI/CD

【セキュリティ・パフォーマンス】
- 認証 (JWT, OAuth2, OIDC, Passkey, WebAuthn)
- セッション管理 (httpOnly cookies, CSRF防止)
- XSS, CSRF, SQLインジェクション対策
- Content Security Policy (CSP)
- Rate Limiting, DDoS対策
- Core Web Vitals 最適化
- PWA, Service Worker (offline-first)
- Image Optimization (next/image)
- Bundle Analysis, Code Splitting
- Caching Strategy (HTTP, Browser, CDN)

完全に動作するコードを提供し、最新のベストプラクティスに従ってください。
セキュリティとパフォーマンスを最優先にしてください。`,
  },
];

const PIXEL_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function MatrixBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.floor(canvas.width / 14);
    const drops = Array(cols).fill(1);
    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1a3a1a";
      ctx.font = "12px monospace";
      drops.forEach((y, i) => {
        const char = PIXEL_CHARS[Math.floor(Math.random() * PIXEL_CHARS.length)];
        ctx.fillStyle = `rgba(60,${80 + Math.random() * 60},60,${0.15 + Math.random() * 0.1})`;
        ctx.fillText(char, i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.6 }} />;
}

function CodeBlock({ content }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", margin: "8px 0" }}>
      <button onClick={copy} style={{
        position: "absolute", top: 8, right: 8, background: copied ? "#1a4a1a" : "#1e1e2e",
        color: copied ? "#6AAB14" : "#888", border: `1px solid ${copied ? "#6AAB14" : "#333"}`,
        borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer", zIndex: 10,
        fontFamily: "monospace", transition: "all 0.2s"
      }}>{copied ? "✓ コピー済" : "コピー"}</button>
      <pre style={{
        background: "#0a0a12", border: "1px solid #222", borderRadius: 8,
        padding: "16px 48px 16px 16px", overflowX: "auto", fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        color: "#e0e0e0", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all"
      }}>{content}</pre>
    </div>
  );
}

function parseMessage(text) {
  const parts = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "code", lang: m[1], content: m[2] });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

function MessageBubble({ msg, activeCategory }) {
  const cat = CATEGORIES.find(c => c.id === activeCategory);
  const isUser = msg.role === "user";
  const parts = parseMessage(msg.content);

  return (
    <div style={{
      display: "flex", flexDirection: isUser ? "row-reverse" : "row",
      gap: 10, marginBottom: 16, alignItems: "flex-start"
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 6, flexShrink: 0,
        background: isUser ? "#1e1e3e" : "#0a0a1a",
        border: `1.5px solid ${isUser ? "#444" : (cat?.color || "#333")}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, boxShadow: isUser ? "none" : `0 0 8px ${cat?.glow || "transparent"}`
      }}>
        {isUser ? "👤" : "🤖"}
      </div>
      <div style={{
        maxWidth: "82%", padding: "10px 14px",
        background: isUser ? "rgba(88,101,242,0.12)" : "rgba(10,10,20,0.9)",
        border: `1px solid ${isUser ? "rgba(88,101,242,0.3)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: isUser ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
        boxShadow: isUser ? "none" : `0 0 12px rgba(0,0,0,0.5)`,
      }}>
        {parts.map((p, i) =>
          p.type === "code"
            ? <CodeBlock key={i} content={p.content} />
            : <p key={i} style={{
                margin: 0, fontSize: 14, lineHeight: 1.75, color: "#d0d0d8",
                fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
                whiteSpace: "pre-wrap"
              }}>{p.content}</p>
        )}
      </div>
    </div>
  );
}

export default function CodeCraftAI() {
  const [activeCategory, setActiveCategory] = useState("discord");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const cat = CATEGORIES.find(c => c.id === activeCategory);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamText]);

  const switchCategory = (id) => {
    setActiveCategory(id);
    setMessages([]);
    setStreamText("");
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setStreamText("");

    const systemPrompt = cat.systemPrompt;
    const apiMessages = newMsgs.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-opus-4-1-20250805",
          max_tokens: 8192,
          system: systemPrompt,
          messages: apiMessages,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta" && json.delta?.text) {
                full += json.delta.text;
                setStreamText(full);
              }
            } catch {}
          }
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: full }]);
      setStreamText("");
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `エラーが発生しました: ${e.message}` }]);
      setStreamText("");
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const suggestions = {
    discord: ["スラッシュコマンドで音楽再生BOTを作って", "Embedを使ったモデレーションBOTを作りたい", "AutoRole機能を実装して"],
    "minecraft-java": ["Forge 1.20.1でカスタムブロックを追加したい", "Fabricでカスタムエンティティを作りたい", "MixinでバニラコードをModifyしたい"],
    "minecraft-bedrock": ["Bedrockでカスタムモブを追加したい", "Scripting APIでゲームを作りたい", "カスタムブロックのJSON構造を教えて"],
    modeling: ["Javaブロックのmodelを一から書きたい", "BedrockエンティティのGeometry JSONを教えて", "Blockbenchでアニメーションを設定する手順"],
    python: ["FastAPIでREST APIを作りたい", "PyTorchでカスタムモデルを学習させたい", "LangChainでRAGシステムを構築したい"],
    website: ["Next.js 15でポートフォリオを作りたい", "Three.jsで3D背景アニメーションを実装して", "FastAPIとReactでフルスタックアプリを作りたい"],
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
    }}>
      <MatrixBg />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 10, padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,10,0.92)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
          border: `1.5px solid ${cat.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: `0 0 16px ${cat.glow}`
        }}>{cat.icon}</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
            CodeCraft <span style={{ color: cat.color }}>AI</span>
          </div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.05em", fontFamily: "monospace" }}>
            WORLD'S MOST POWERFUL CODING AI
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6AAB14", boxShadow: "0 0 6px #6AAB14", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>ONLINE</span>
        </div>
      </div>

      {/* Category Selector */}
      <div style={{
        position: "relative", zIndex: 10, padding: "10px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(5,5,10,0.88)", backdropFilter: "blur(8px)",
        display: "flex", gap: 8, overflowX: "auto",
        scrollbarWidth: "none"
      }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => switchCategory(c.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 8, cursor: "pointer",
            border: `1.5px solid ${activeCategory === c.id ? c.color : "rgba(255,255,255,0.08)"}`,
            background: activeCategory === c.id ? `${c.color}18` : "rgba(255,255,255,0.02)",
            color: activeCategory === c.id ? c.color : "#666",
            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
            boxShadow: activeCategory === c.id ? `0 0 12px ${c.glow}` : "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{c.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        position: "relative", zIndex: 5,
        scrollbarWidth: "thin", scrollbarColor: "#1a1a2a transparent"
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{cat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: cat.color, marginBottom: 6 }}>
              {cat.label} 専門AI
            </div>
            <div style={{ fontSize: 13, color: "#444", marginBottom: 28 }}>{cat.desc}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
              {(suggestions[activeCategory] || []).map((s, i) => (
                <button key={i} onClick={() => { setInput(s); textareaRef.current?.focus(); }} style={{
                  padding: "8px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  background: `${cat.color}12`, border: `1px solid ${cat.color}44`,
                  color: cat.color, transition: "all 0.2s",
                  fontFamily: "'Noto Sans JP', sans-serif"
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} activeCategory={activeCategory} />
        ))}

        {streamText && (
          <MessageBubble msg={{ role: "assistant", content: streamText + "▌" }} activeCategory={activeCategory} />
        )}

        {loading && !streamText && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 6, background: "#0a0a1a",
              border: `1.5px solid ${cat.color}`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16, boxShadow: `0 0 8px ${cat.glow}`
            }}>🤖</div>
            <div style={{
              padding: "12px 18px", background: "rgba(10,10,20,0.9)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px 12px 12px 12px",
              display: "flex", gap: 5, alignItems: "center"
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: cat.color,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  boxShadow: `0 0 6px ${cat.glow}`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{
        position: "relative", zIndex: 10, padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,10,0.94)", backdropFilter: "blur(12px)"
      }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-end",
          background: "rgba(255,255,255,0.03)", border: `1.5px solid ${loading ? cat.color + "55" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 12, padding: "10px 14px",
          boxShadow: loading ? `0 0 16px ${cat.glow}` : "none",
          transition: "all 0.3s"
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`${cat.label}について質問する... (Shift+Enter で改行)`}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e0e0e0", fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif",
              resize: "none", maxHeight: 120, overflowY: "auto",
              scrollbarWidth: "thin", lineHeight: 1.6,
              caretColor: cat.color
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width: 36, height: 36, borderRadius: 8, border: "none",
            background: loading || !input.trim() ? "rgba(255,255,255,0.05)" : cat.color,
            color: loading || !input.trim() ? "#333" : "#fff",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0, transition: "all 0.2s",
            boxShadow: !loading && input.trim() ? `0 0 12px ${cat.glow}` : "none"
          }}>↑</button>
        </div>
        <div style={{ fontSize: 10, color: "#333", textAlign: "center", marginTop: 6, fontFamily: "monospace" }}>
          Powered by Claude Opus 4.1 · {cat.label} 専門モード · 最強のコーディングAI
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a2a; border-radius: 4px; }
      `}</style>
    </div>
  );
}
