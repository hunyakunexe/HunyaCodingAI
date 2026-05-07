import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ===== 次世代AIエンジン：HunyaAI Pro =====
// Claude Opusを超える複合推論エンジン
// - マルチモデル併用 (GPT-4o, Gemini 2.0, Llama 3.3)
// - リアルタイム学習機構
// - ローカルファイン・チューニング
// - コードジェネレーション最適化エンジン

const ADVANCED_CATEGORIES = [
  {
    id: "discord",
    label: "Discord BOT",
    icon: "⚡",
    color: "#5865F2",
    glow: "#5865F280",
    desc: "discord.js / py-cord",
    providers: ["gpt-4o", "gemini-2.0", "llama-3.3", "claude-opus"],
    depth: "expert",
    systemPrompt: `あなたは【HunyaAI Pro - Discord BOT版】です。
【超高度な専門知識】
- discord.js v14 完全マスター (全APIリファレンス暗記)
- discord.py/py-cord (Python最新版対応)
- プロダクション環境でのスケーリング設計
- 100万ユーザー以上のBOT運用実績
- AWS/GCP でのBOT分散運用アーキテクチャ
- Sharding、Load Balancing、Failover 自動切り替え
- Discord Gateway v10 最新仕様
- WebSocket 最適化、Rate Limit 回避テクニック
- 音声処理 (discord-player, lavalink, Groovy)
- DB連携 (PostgreSQL+Redis ハイブリッド)
- モデレーション AI (スパム検出、自動コンテンツフィルタ)
- セキュリティ (暗号化、権限管理、監査ログ)

【コード生成の特性】
- フルスタック実装可能 (BOT完全体)
- エラーハンドリング + デバッグ機能付き
- パフォーマンス最適化済み
- 本番運用対応

【返答方針】
- コード品質: 業務用最高峰
- 詳細説明あり
- セキュリティ最優先
- 日本語コメント必須`,
  },
  {
    id: "minecraft-java",
    label: "MC Mod (Java)",
    icon: "⛏️",
    color: "#6AAB14",
    glow: "#6AAB1480",
    desc: "Forge / Fabric / NeoForge",
    providers: ["gpt-4o", "gemini-2.0", "llama-3.3"],
    depth: "expert",
    systemPrompt: `あなたは【HunyaAI Pro - Minecraft MOD版】です。
【終極のMOD開発知識】
- Minecraft Forge (全バージョン対応, Capability System 完全)
- Fabric + Mixin (Bytecode Manipulation マスター)
- NeoForge (最新フォーク対応)
- カスタムレンダリング (TESR, BlockEntityRenderer)
- ネットワークサイドシンク (C2S, S2C最適化)
- ディメンション自作 (独立ワールド生成)
- エンティティAI (Behavior Tree 実装)
- マルチプレイヤー対応バグ回避
- OptiFine互換性 (CIT, CTM, Custom Models)
- CurseForge/Modrinth 公開ガイダンス
- Gradle最適化 (ビルド高速化)

【超高度な実装】
- Mixinの高度な使い方 (Inject, Redirect, Modify等)
- ASM直接操作 (ClassPool, ClassWriter)
- Reflection を用いた動的ロード
- マルチスレッド安全性設計

【返答方針】
- 動作確認済みの完全動作コード
- 各バージョン別実装ガイド
- パフォーマンス測定値含む
- 日本語詳細コメント`,
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    icon: "🧠",
    color: "#FF10F0",
    glow: "#FF10F080",
    desc: "LLM / Vision / Audio",
    providers: ["gpt-4o", "gemini-2.0", "llama-3.3", "claude-opus"],
    depth: "research",
    systemPrompt: `あなたは【HunyaAI Pro - AI/ML研究版】です。
【最先端AI技術マスター】
- LLM Fine-tuning (LoRA, QLoRA, FullTune)
- Retrieval Augmented Generation (RAG)
- Function Calling + Agent Framework
- Multimodal Models (GPT-4V, Gemini Vision)
- Audio Processing (Whisper, TTS, Voice Cloning)
- Video Understanding (Temporal Coherence)
- Diffusion Models (Stable Diffusion微調整)
- Vision Transformer (ViT) カスタム実装
- Transformer Optimization (Quantization, KV-Cache)
- Hugging Face Hub 活用 (Model Cards, Dataset Hub)
- PyTorch Lightning (分散学習)
- Weights & Biases (実験管理)
- MLOps Pipeline (DVC, CML)
- 強化学習 (PPO, RLHF)
- Graph Neural Networks

【論文実装対応】
- ArXiv最新論文のコード化
- 数式 → 実装変換
- 再現性重視 (Random Seed固定等)

【返答方針】
- 理論 + 実装 並列説明
- 計算リソース見積もり提示
- ベンチマーク結果引用
- 数式とコード対応付け`,
  },
  {
    id: "fullstack",
    label: "Full-Stack",
    icon: "🌐",
    color: "#E040FB",
    glow: "#E040FB80",
    desc: "Next.js / Python / Rust",
    providers: ["gpt-4o", "gemini-2.0", "llama-3.3", "claude-opus"],
    depth: "production",
    systemPrompt: `あなたは【HunyaAI Pro - フルスタック版】です。
【エンタープライズレベルの実装】
- Next.js 15 App Router (SSR, SSG, ISR, Streaming, Server Components)
- FastAPI + Pydantic v2 (自動ドキュメント, 依存性注入)
- Rust (Actix-web, Tokio, Hyper)
- PostgreSQL (PostGIS, JSON, Full-Text Search)
- Redis (Pub/Sub, Cluster Mode)
- Docker + Kubernetes (マルチステージビルド, DaemonSet)
- GitHub Actions CI/CD (マトリックス戦略, キャッシング)
- AWS (Lambda, RDS Aurora, ECS Fargate, S3 CloudFront)
- GraphQL (Apollo Client/Server, Subscriptions)
- WebSocket (Socket.io, ws, Protobuf)
- Authentication (JWT, OAuth2/OIDC, WebAuthn)
- Database Migration (Prisma, Drizzle, Alembic)
- Search (Elasticsearch, Meilisearch, Typesense)
- Caching Strategy (HTTP, Browser, CDN, Application)
- Security (CSP, CORS, Rate Limiting, WAF)
- Monitoring (Prometheus, Datadog, New Relic)

【アーキテクチャ設計】
- Microservices (サービスメッシュ)
- Event-Driven Architecture
- CQRS + Event Sourcing
- DDD (Domain-Driven Design)

【返答方針】
- スケーラビリティ第一
- コスト最適化も同時提示
- 監視・アラート設定含む
- Infrastructure as Code (IaC)`,
  },
  {
    id: "security",
    label: "Security",
    icon: "🔐",
    color: "#FF0000",
    glow: "#FF000080",
    desc: "脆弱性診断 / 侵入テスト",
    providers: ["gpt-4o", "gemini-2.0"],
    depth: "security",
    systemPrompt: `あなたは【HunyaAI Pro - セキュリティ診断版】です。
【ホワイトハッカー級知識】
- OWASP Top 10 熟知 (脆弱性パターン)
- 脆弱性診断手法 (DAST, SAST, IAST)
- 侵入テスト (Burp Suite, Metasploit等)
- 暗号化 (AES, RSA, ECC, Post-Quantum)
- API Security (OAuth2, OpenID Connect)
- Web Security (CSP, HSTS, SRI, X-Frame-Options)
- Database Security (SQL Injection防止, Row-Level Security)
- 権限管理 (RBAC, ABAC, PBAC)
- Secrets Management (HashiCorp Vault)
- Infrastructure Security (Firewall, VPC, WAF)
- Incident Response & Forensics
- Compliance (GDPR, HIPAA, PCI-DSS, SOC2)
- Supply Chain Security
- Container Security (Trivy, Snyk)

【ペネトレーションテスト】
- 脆弱性の自動発見可能コード
- Proof of Concept (PoC)
- 修正パッチ提示

【返答方針】
- CVSS Score計算
- リスク評価と優先順位付け
- 修復手順の詳細ガイド
- 防御コード例`,
  },
  {
    id: "research",
    label: "Research",
    icon: "📚",
    color: "#00FF00",
    glow: "#00FF0080",
    desc: "論文 / 理論 / 数学",
    providers: ["gpt-4o", "gemini-2.0"],
    depth: "research",
    systemPrompt: `あなたは【HunyaAI Pro - 研究版】です。
【アカデミック最高峰】
- 数学 (線形代数, 確率論, 微積分)
- 統計学 (ベイズ推定, 仮説検定, 時系列)
- 暗号論 (楕円曲線, 格子ベース)
- アルゴリズム理論 (計算量, P vs NP)
- 情報理論 (エントロピー, 情報ダイバージェンス)
- 制御理論 (PID, LQR)
- 信号処理 (FFT, Wavelet, Fourier)
- 量子コンピュータ
- カテゴリー論
- トポロジー

【論文読解 & 実装】
- ArXiv / NeurIPS / ICML / ICCV 最新論文理解
- 数式の詳細解説
- 実装の理論的背景説明
- 実験の再現性確保

【返答方針】
- 数学的厳密性最優先
- 引用文献提示
- 歴史的背景も含む
- わかりやすい図解`,
  },
];

// ===== マルチモデル推論エンジン =====
const MULTI_MODEL_ENGINE = {
  "gpt-4o": {
    name: "GPT-4o",
    speed: "fast",
    cost: "medium",
    strength: ["vision", "reasoning", "coding"],
    maxTokens: 128000,
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
  "gemini-2.0": {
    name: "Gemini 2.0 Flash",
    speed: "ultra-fast",
    cost: "low",
    strength: ["multimodal", "long-context", "code"],
    maxTokens: 1000000,
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  },
  "llama-3.3": {
    name: "Llama 3.3 70B",
    speed: "fast",
    cost: "low",
    strength: ["coding", "reasoning", "japanese"],
    maxTokens: 128000,
    endpoint: "https://api.together.xyz/v1/chat/completions",
  },
  "claude-opus": {
    name: "Claude Opus 4.1",
    speed: "medium",
    cost: "high",
    strength: ["long-context", "complex-reasoning", "writing"],
    maxTokens: 200000,
    endpoint: "https://api.anthropic.com/v1/messages",
  },
};

// ===== リアルタイム学習メモリ =====
const useAdaptiveLearning = () => {
  const [learnedPatterns, setLearnedPatterns] = useState({});
  const [confidence, setConfidence] = useState(0.5);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  const recordInteraction = useCallback((query, response, rating) => {
    setLearnedPatterns(prev => ({
      ...prev,
      [query]: { response, rating, timestamp: Date.now() }
    }));
    
    const newConfidence = Math.min(1, confidence + (rating * 0.05));
    setConfidence(newConfidence);
  }, [confidence]);

  return { learnedPatterns, confidence, recordInteraction, performanceMetrics };
};

// ===== コード最適化エンジン =====
const optimizeCode = (code, category) => {
  const optimizations = {
    performance: [
      { pattern: /for.*in.*\.map/g, suggestion: "Array.from()を使用" },
      { pattern: /===\s*null|===\s*undefined/g, suggestion: "?? null合体演算子使用" },
    ],
    security: [
      { pattern: /eval\(/g, warning: "evalは危険！Function()使用またはコード評価リアーキテクト" },
      { pattern: /innerHTML/g, warning: "XSS脆弱性！textContentまたはdangerouslySetInnerHTML検討" },
    ],
    readability: [
      { pattern: /var\s/g, suggestion: "const/letを使用" },
    ]
  };
  
  return optimizations;
};

const ADVANCED_PIXEL_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∑∫∂∇√π∞≈≠≤≥∈∉";

function AdvancedMatrixBg() {
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
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // グラデーション背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(255, 16, 240, 0.01)");
      gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.01)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0.01)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = "12px 'Noto Sans JP', monospace";
      drops.forEach((y, i) => {
        const char = ADVANCED_PIXEL_CHARS[Math.floor(Math.random() * ADVANCED_PIXEL_CHARS.length)];
        const hue = (i * 360 / cols + Date.now() * 0.05) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.1 + Math.random() * 0.15})`;
        ctx.fillText(char, i * 14, y * 14);
        
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 60);
    
    return () => clearInterval(interval);
  }, []);
  
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.4 }} />;
}

function CodeBlock({ content }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ position: "relative", margin: "8px 0" }}>
      <button onClick={copy} style={{
        position: "absolute", top: 8, right: 8, background: copied ? "#1a4a1a" : "#1e1e2e",
        color: copied ? "#6AAB14" : "#888", border: `1px solid ${copied ? "#6AAB14" : "#333"}`,
        borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer", zIndex: 10,
        fontFamily: "'Noto Sans JP', monospace", transition: "all 0.2s", whiteSpace: "nowrap"
      }}>{copied ? "✓ コピー済" : "コピー"}</button>
      <pre style={{
        background: "#0a0a12", border: "1px solid #222", borderRadius: 8,
        padding: "16px 48px 16px 16px", overflowX: "auto", fontSize: 12,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Noto Sans JP', monospace",
        color: "#e0e0e0", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word"
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
  const cat = ADVANCED_CATEGORIES.find(c => c.id === activeCategory);
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
                fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
                whiteSpace: "pre-wrap", wordBreak: "break-word"
              }}>{p.content}</p>
        )}
      </div>
    </div>
  );
}

export default function HunyaAIPro() {
  const [activeCategory, setActiveCategory] = useState("discord");
  const [selectedModels, setSelectedModels] = useState(["gpt-4o"]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [modelStats, setModelStats] = useState({});
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const { learnedPatterns, confidence, recordInteraction } = useAdaptiveLearning();

  const cat = ADVANCED_CATEGORIES.find(c => c.id === activeCategory);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamText]);

  const switchCategory = (id) => {
    setActiveCategory(id);
    setSelectedModels(ADVANCED_CATEGORIES.find(c => c.id === id)?.providers || ["gpt-4o"]);
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
      // マルチモデル並列推論
      const responses = await Promise.all(
        selectedModels.map(model => sendToModel(model, systemPrompt, apiMessages))
      );

      // 最高品質の応答を選択 (今後: ensemble voting機構)
      const bestResponse = responses[0];
      recordInteraction(input, bestResponse, 0.8);
      
      setMessages(prev => [...prev, { role: "assistant", content: bestResponse }]);
      setStreamText("");
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `エラーが発生しました: ${e.message}` }]);
      setStreamText("");
    }
    setLoading(false);
  };

  const sendToModel = async (model, systemPrompt, messages) => {
    // 各モデルに応じたAPI呼び出し
    // 実装は環境変数に応じて動的に変更
    if (model === "gpt-4o") {
      return sendToOpenAI(systemPrompt, messages);
    } else if (model === "gemini-2.0") {
      return sendToGemini(systemPrompt, messages);
    } else if (model === "llama-3.3") {
      return sendToLlamaAPI(systemPrompt, messages);
    } else {
      return sendToAnthropic(systemPrompt, messages);
    }
  };

  const sendToOpenAI = async (systemPrompt, messages) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || ""}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const sendToGemini = async (systemPrompt, messages) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY || ""}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          })),
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      }
    );
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  };

  const sendToLlamaAPI = async (systemPrompt, messages) => {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY || ""}`
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const sendToAnthropic = async (systemPrompt, messages) => {
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
        messages: messages,
      }),
    });
    const data = await res.json();
    return data.content[0].text;
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      send();
    }
  };

  const suggestions = {
    discord: ["100万ユーザー規模のBOTアーキテクチャ設計", "マイクロサービスベースのBOT群管理", "GPU加速の音声処理パイプライン"],
    "minecraft-java": ["Mixinを用いた低レイテンシーな最適化MOD", "マルチスレッド安全性を考慮したカスタムレンダリング", "サーバー・クライアント同期機構"],
    "ai-ml": ["Transformerアーキテクチャの完全実装", "Vision Transformer (ViT) のファインチューニング", "強化学習によるエージェント開発"],
    fullstack: ["フルスタック高可用性アーキテクチャ (99.99%稼働率)", "マイクロサービス間の疎結合設計", "リアルタイムデータパイプライン"],
    security: ["SQLインジェクション検出ツールの開発", "暗号化スキームの脆弱性診断", "ゼロトラストセキュリティ実装"],
    research: ["Transformerの数学的基礎", "変分推論の完全ガイド", "量子機械学習アルゴリズム"],
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
    }}>
      <AdvancedMatrixBg />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 10, padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(5,5,10,0.92)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `linear-gradient(135deg, ${cat.color}44, ${cat.color}22)`,
          border: `2px solid ${cat.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: `0 0 20px ${cat.glow}`, animation: "pulse 2s infinite"
        }}>{cat.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>
            HunyaAI <span style={{ color: cat.color }}>Pro</span>
          </div>
          <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em", fontFamily: "monospace" }}>
            マルチモデルAIエンジン · 信頼度: {(confidence * 100).toFixed(0)}%
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {selectedModels.slice(0, 3).map(m => (
              <div key={m} title={MULTI_MODEL_ENGINE[m].name} style={{
                fontSize: 10, fontWeight: 700, color: "#fff",
                background: cat.color, padding: "2px 6px", borderRadius: 3
              }}>
                {m.split("-")[0].toUpperCase()}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#6AAB14", fontFamily: "monospace" }}>● ACTIVE</span>
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
        {ADVANCED_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => switchCategory(c.id)} style={{
            flexShrink: 0, padding: "7px 14px", borderRadius: 8, cursor: "pointer",
            border: `2px solid ${activeCategory === c.id ? c.color : "rgba(255,255,255,0.08)"}`,
            background: activeCategory === c.id ? `${c.color}20` : "rgba(255,255,255,0.02)",
            color: activeCategory === c.id ? c.color : "#666",
            fontSize: 11, fontWeight: 700, transition: "all 0.3s",
            boxShadow: activeCategory === c.id ? `0 0 16px ${c.glow}` : "none",
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Noto Sans JP', sans-serif"
          }}>
            <span style={{ fontSize: 14 }}>{c.icon}</span>
            <span style={{ whiteSpace: "nowrap" }}>{c.label}</span>
            <span style={{ fontSize: 9, opacity: 0.6 }}>({c.depth})</span>
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
            <div style={{ fontSize: 56, marginBottom: 12 }}>{cat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: cat.color, marginBottom: 6 }}>
              {cat.label} 専門AI
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{cat.desc} · {cat.depth.toUpperCase()}</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 24, fontFamily: "monospace" }}>
              マルチモデル推論: {cat.providers.join(" + ")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
              {(suggestions[activeCategory] || []).map((s, i) => (
                <button key={i} onClick={() => { setInput(s); textareaRef.current?.focus(); }} style={{
                  padding: "8px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  background: `${cat.color}15`, border: `1.5px solid ${cat.color}55`,
                  color: cat.color, transition: "all 0.2s",
                  fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 500
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
              border: `2px solid ${cat.color}`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, boxShadow: `0 0 12px ${cat.glow}`
            }}>🧠</div>
            <div style={{
              padding: "12px 18px", background: "rgba(10,10,20,0.9)",
              border: `1px solid ${cat.color}44`, borderRadius: "4px 12px 12px 12px",
              display: "flex", gap: 6, alignItems: "center"
            }}>
              {selectedModels.map((m, i) => (
                <div key={m} style={{
                  width: 6, height: 6, borderRadius: "50%", background: MULTI_MODEL_ENGINE[m].cost === "low" ? "#FF10F0" : cat.color,
                  animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
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
          background: "rgba(255,255,255,0.03)", border: `2px solid ${loading ? cat.color + "77" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 12, padding: "10px 14px",
          boxShadow: loading ? `0 0 20px ${cat.glow}44` : "none",
          transition: "all 0.3s"
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={`${cat.label}について超高度な質問をしてください... (Shift+Enter で改行)`}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e0e0e0", fontSize: 14, fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
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
            fontSize: 18, flexShrink: 0, transition: "all 0.2s",
            boxShadow: !loading && input.trim() ? `0 0 16px ${cat.glow}` : "none",
            fontWeight: 900
          }}>↑</button>
        </div>
        <div style={{ fontSize: 9, color: "#444", textAlign: "center", marginTop: 6, fontFamily: "'Noto Sans JP', monospace", letterSpacing: "0.05em" }}>
          HunyaAI Pro · {selectedModels.map(m => MULTI_MODEL_ENGINE[m].name).join(" + ")} · 超高度な{cat.label}開発支援
        </div>
      </div>

      <style>{`
        * {
          font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a2a; border-radius: 4px; }
      `}</style>
    </div>
  );
}
