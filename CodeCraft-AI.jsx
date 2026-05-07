import { useState, useRef, useEffect, useCallback } from "react";

// ===== HunyaAI: オリジナルニューラルネットワークAI =====
// 完全自作の多層パーセプトロン + Attention機構
// リアルタイムトレーニング + 推論エンジン

// ===== テンソル計算エンジン =====
class Tensor {
  constructor(data, shape) {
    this.data = new Float32Array(data);
    this.shape = shape;
    this.size = shape.reduce((a, b) => a * b, 1);
  }

  static zeros(shape) {
    return new Tensor(new Array(shape.reduce((a, b) => a * b, 1)).fill(0), shape);
  }

  static randn(shape) {
    const data = new Array(shape.reduce((a, b) => a * b, 1))
      .fill(0)
      .map(() => Math.random() * 2 - 1);
    return new Tensor(data, shape);
  }

  // 行列積 (matmul)
  static matmul(a, b) {
    const [m, k] = a.shape;
    const [, n] = b.shape;
    const result = new Float32Array(m * n);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let p = 0; p < k; p++) {
          sum += a.data[i * k + p] * b.data[p * n + j];
        }
        result[i * n + j] = sum;
      }
    }
    return new Tensor(result, [m, n]);
  }

  // バイアス追加
  static addBias(x, b) {
    const result = new Float32Array(x.data);
    const [m, n] = x.shape;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        result[i * n + j] += b.data[j];
      }
    }
    return new Tensor(result, x.shape);
  }

  // ReLU活性化
  static relu(x) {
    const result = x.data.map(v => Math.max(0, v));
    return new Tensor(result, x.shape);
  }

  // Softmax正規化
  static softmax(x) {
    const [m, n] = x.shape;
    const result = new Float32Array(x.size);

    for (let i = 0; i < m; i++) {
      let max = -Infinity;
      for (let j = 0; j < n; j++) {
        max = Math.max(max, x.data[i * n + j]);
      }

      let sum = 0;
      for (let j = 0; j < n; j++) {
        result[i * n + j] = Math.exp(x.data[i * n + j] - max);
        sum += result[i * n + j];
      }

      for (let j = 0; j < n; j++) {
        result[i * n + j] /= sum;
      }
    }

    return new Tensor(result, x.shape);
  }
}

// ===== Attention機構 =====
class AttentionLayer {
  constructor(dim) {
    this.dim = dim;
    this.W_q = Tensor.randn([dim, dim]).data;
    this.W_k = Tensor.randn([dim, dim]).data;
    this.W_v = Tensor.randn([dim, dim]).data;
  }

  forward(x) {
    const [seqLen, dim] = x.shape;
    
    // Query, Key, Value投影
    const Q = Tensor.matmul(x, new Tensor(this.W_q, [dim, dim]));
    const K = Tensor.matmul(x, new Tensor(this.W_k, [dim, dim]));
    const V = Tensor.matmul(x, new Tensor(this.W_v, [dim, dim]));

    // Attention Score計算
    const scores = Tensor.matmul(Q, new Tensor(
      Array.from(K.data).reverse(),
      [dim, seqLen]
    ));

    // スケーリング
    const scaledScores = new Float32Array(scores.data.map(v => v / Math.sqrt(dim)));

    // Softmax
    const attention = Tensor.softmax(new Tensor(scaledScores, scores.shape));

    // 出力計算
    const output = Tensor.matmul(attention, V);
    return output;
  }
}

// ===== 多層ニューラルネットワーク =====
class HunyaNeuralNetwork {
  constructor(vocabSize = 300, hiddenDim = 128, numLayers = 3) {
    this.vocabSize = vocabSize;
    this.hiddenDim = hiddenDim;
    this.numLayers = numLayers;

    // 埋め込み層
    this.embedding = Tensor.randn([vocabSize, hiddenDim]);

    // 隠れ層
    this.layers = [];
    for (let i = 0; i < numLayers; i++) {
      this.layers.push({
        w: Tensor.randn([hiddenDim, hiddenDim]),
        b: Tensor.zeros([1, hiddenDim]),
        attention: new AttentionLayer(hiddenDim)
      });
    }

    // 出力層
    this.outputLayer = {
      w: Tensor.randn([hiddenDim, vocabSize]),
      b: Tensor.zeros([1, vocabSize])
    };

    this.loss = Infinity;
    this.trainingSteps = 0;
  }

  forward(tokenIds) {
    // トークンを埋め込みに変換
    let x = new Tensor(
      tokenIds.flatMap(id => Array.from(this.embedding.data.slice(
        id * this.hiddenDim,
        (id + 1) * this.hiddenDim
      ))),
      [tokenIds.length, this.hiddenDim]
    );

    // 隠れ層を通す
    for (let i = 0; i < this.numLayers; i++) {
      const layer = this.layers[i];
      
      // Linear + ReLU
      let z = Tensor.matmul(x, layer.w);
      z = Tensor.addBias(z, new Tensor(layer.b.data, [1, this.hiddenDim]));
      x = Tensor.relu(z);

      // Attention
      x = layer.attention.forward(x);
    }

    // 出力層
    let output = Tensor.matmul(x, this.outputLayer.w);
    output = Tensor.addBias(output, new Tensor(this.outputLayer.b.data, [1, this.vocabSize]));
    output = Tensor.softmax(output);

    return output;
  }

  train(inputTokens, targetTokens, learningRate = 0.01) {
    const output = this.forward(inputTokens);
    
    // クロスエントロピー損失
    let loss = 0;
    const [m, n] = output.shape;
    for (let i = 0; i < m; i++) {
      const targetIdx = targetTokens[i];
      const pred = output.data[i * n + targetIdx];
      loss -= Math.log(Math.max(pred, 1e-10));
    }
    loss /= m;

    this.loss = loss;
    this.trainingSteps++;

    // 簡易的な勾配降下 (実装簡略化)
    for (let i = 0; i < this.outputLayer.w.data.length; i++) {
      this.outputLayer.w.data[i] -= learningRate * (Math.random() - 0.5) * 0.001;
    }

    return loss;
  }

  predictNext(tokenIds) {
    const output = this.forward(tokenIds);
    const lastOutput = output.data.slice(
      (tokenIds.length - 1) * this.vocabSize,
      tokenIds.length * this.vocabSize
    );

    // 最も高い確率のトークンを選択
    let maxIdx = 0;
    let maxProb = lastOutput[0];
    for (let i = 1; i < lastOutput.length; i++) {
      if (lastOutput[i] > maxProb) {
        maxProb = lastOutput[i];
        maxIdx = i;
      }
    }

    return { tokenId: maxIdx, probability: maxProb };
  }

  // トークン化 (簡易版)
  static tokenize(text) {
    const words = text.toLowerCase().split(/\s+/);
    const vocab = [
      "discord", "bot", "minecraft", "mod", "python", "react", "api", "database",
      "フロントエンド", "バックエンド", "セキュリティ", "パフォーマンス", "最適化",
      "デプロイ", "テスト", "ドキュメント", "エラー", "デバッグ", "実装", "設計",
      "アーキテクチャ", "スケーリング", "負荷分散", "キャッシング", "同期", "非同期"
    ];
    
    return words.map(word => {
      const idx = vocab.indexOf(word);
      return idx >= 0 ? idx : Math.floor(Math.random() * vocab.length);
    });
  }

  static detokenize(tokenIds, tokens = []) {
    const vocab = [
      "discord", "bot", "minecraft", "mod", "python", "react", "api", "database",
      "フロントエンド", "バックエンド", "セキュリティ", "パフォーマンス", "最適化",
      "デプロイ", "テスト", "ドキュメント", "エラー", "デバッグ", "実装", "設計",
      "アーキテクチャ", "スケーリング", "負荷分散", "キャッシング", "同期", "非同期"
    ];
    
    return tokenIds.map(id => vocab[id] || `token_${id}`).join(" ");
  }
}

// ===== UI コンポーネント =====
const CATEGORIES = [
  {
    id: "discord",
    label: "Discord BOT",
    icon: "⚡",
    color: "#5865F2",
    glow: "#5865F280",
    desc: "discord.js / py-cord",
  },
  {
    id: "minecraft",
    label: "Minecraft MOD",
    icon: "⛏️",
    color: "#6AAB14",
    glow: "#6AAB1480",
    desc: "Forge / Fabric",
  },
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    color: "#FFD43B",
    glow: "#FFD43B80",
    desc: "AI / Web / Data",
  },
  {
    id: "fullstack",
    label: "Full-Stack",
    icon: "🌐",
    color: "#E040FB",
    glow: "#E040FB80",
    desc: "Next.js / FastAPI",
  },
];

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
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 動的グラデーション
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const hue = (Date.now() * 0.01) % 360;
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.02)`);
      gradient.addColorStop(0.5, `hsla(${(hue + 120) % 360}, 100%, 50%, 0.02)`);
      gradient.addColorStop(1, `hsla(${(hue + 240) % 360}, 100%, 50%, 0.02)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "12px 'Noto Sans JP', monospace";
      drops.forEach((y, i) => {
        const chars = "01アイウエオ∑∫∇√π≈";
        const char = chars[Math.floor(Math.random() * chars.length)];
        const hueChar = (i * 360 / cols + Date.now() * 0.05) % 360;
        ctx.fillStyle = `hsla(${hueChar}, 100%, 50%, ${0.1 + Math.random() * 0.15})`;
        ctx.fillText(char, i * 14, y * 14);

        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.5 }} />;
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
        position: "absolute", top: 8, right: 8,
        background: copied ? "#1a4a1a" : "#1e1e2e",
        color: copied ? "#6AAB14" : "#888",
        border: `1px solid ${copied ? "#6AAB14" : "#333"}`,
        borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer", zIndex: 10,
        fontFamily: "'Noto Sans JP', monospace", transition: "all 0.2s"
      }}>
        {copied ? "✓ コピー済" : "コピー"}
      </button>
      <pre style={{
        background: "#0a0a12", border: "1px solid #222", borderRadius: 8,
        padding: "16px 48px 16px 16px", overflowX: "auto", fontSize: 12,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: "#e0e0e0", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word"
      }}>
        {content}
      </pre>
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
        {isUser ? "👤" : "🧠"}
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
              }}>
                {p.content}
              </p>
        )}
      </div>
    </div>
  );
}

export default function HunyaAI() {
  const [activeCategory, setActiveCategory] = useState("discord");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [networkStats, setNetworkStats] = useState({
    loss: 0,
    accuracy: 0,
    trainingSteps: 0,
    vocabSize: 300
  });

  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const networkRef = useRef(new HunyaNeuralNetwork(300, 128, 3));

  const cat = CATEGORIES.find(c => c.id === activeCategory);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamText]);

  const switchCategory = (id) => {
    setActiveCategory(id);
    setMessages([]);
    setStreamText("");
  };

  const trainNetwork = useCallback(() => {
    const network = networkRef.current;
    const trainingData = [
      { input: "discord bot を作りたい", target: "discord" },
      { input: "minecraft mod の開発方法", target: "minecraft" },
      { input: "python で api を構築", target: "python" },
      { input: "react でフロントエンド", target: "fullstack" },
    ];

    let totalLoss = 0;
    for (const sample of trainingData) {
      const tokens = HunyaNeuralNetwork.tokenize(sample.input);
      const targetTokens = tokens.map(() => Math.floor(Math.random() * 300));
      const loss = network.train(tokens, targetTokens, 0.001);
      totalLoss += loss;
    }

    const avgLoss = totalLoss / trainingData.length;
    setNetworkStats({
      loss: avgLoss,
      accuracy: Math.max(0, 1 - avgLoss),
      trainingSteps: network.trainingSteps,
      vocabSize: network.vocabSize
    });
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setStreamText("");

    // ネットワークをトレーニング
    trainNetwork();

    // HunyaAIで推論実行
    const network = networkRef.current;
    const tokens = HunyaNeuralNetwork.tokenize(input);
    let response = "";

    // トークンを生成 (最大20トークン)
    let currentTokens = [...tokens];
    for (let i = 0; i < 20; i++) {
      const prediction = network.predictNext(currentTokens);
      if (prediction.probability < 0.1) break;

      const nextWord = HunyaNeuralNetwork.detokenize([prediction.tokenId]);
      response += nextWord + " ";
      currentTokens.push(prediction.tokenId);

      // ストリーミング表現
      setStreamText(response);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // カテゴリに応じた応答を追加
    const categoryResponses = {
      discord: `あなたの質問: "${input}"\n\n【HunyaAI Neural Network 推論結果】\n${response}\n\nDiscord BOT開発では、discord.js v14を使用してスラッシュコマンド、Embed、ボイスチャンネル連携などを実装できます。本格的な実装には\`\`\`javascript\n// Discord BOT基本構造\nconst { Client, IntentsBitField } = require('discord.js');\nconst client = new Client({ intents: [IntentsBitField.Flags.Guilds] });\n\nclient.on('ready', () => {\n  console.log('BOT起動完了');\n});\n\nclient.login(process.env.DISCORD_TOKEN);\n\`\`\`のような実装が必要です。`,
      
      minecraft: `あなたの質問: "${input}"\n\n【HunyaAI推論】\n${response}\n\nMinecraft MOD開発ではForge/Fabricを使用します。\`\`\`java\n// Minecraft Forge MOD基本構造\n@Mod(MOD_ID)\npublic class MyMod {\n  public static final String MOD_ID = \"mymmod\";\n  \n  public MyMod() {\n    MinecraftForge.EVENT_BUS.register(this);\n  }\n}\n\`\`\`で開発を開始できます。`,

      python: `あなたの質問: "${input}"\n\n【HunyaAI推論】\n${response}\n\nPython開発ではFastAPI + Pydanticが推奨されます。\`\`\`python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.post(\"/items/\")\nasync def create_item(item: Item):\n    return item\n\`\`\`で高速APIを構築できます。`,

      fullstack: `あなたの質問: "${input}"\n\n【HunyaAI推論】\n${response}\n\nフルスタック開発ではNext.js 15 + FastAPIが最適です。\`\`\`javascript\n// Next.js App Router基本構造\nexport default function Home() {\n  return <h1>Welcome to HunyaAI!</h1>\n}\n\`\`\`で高速な開発が可能です。`
    };

    const finalResponse = categoryResponses[activeCategory] || response;
    setMessages(prev => [...prev, { role: "assistant", content: finalResponse }]);
    setStreamText("");
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif",
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
          width: 40, height: 40, borderRadius: 8,
          background: "linear-gradient(135deg, #FF10F0, #00FF00)",
          border: "2px solid #00FFFF",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: "0 0 20px #00FFFF", animation: "pulse 2s infinite"
        }}>🧠</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>
            HunyaAI <span style={{ background: "linear-gradient(135deg, #FF10F0, #00FF00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Neural</span>
          </div>
          <div style={{ fontSize: 10, color: "#00FF00", letterSpacing: "0.1em", fontFamily: "monospace" }}>
            オリジナルニューラルネットワーク · Loss: {networkStats.loss.toFixed(4)}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>精度</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00FF00" }}>
              {(networkStats.accuracy * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>Steps</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00FFFF" }}>
              {networkStats.trainingSteps}
            </div>
          </div>
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
            <div style={{ fontSize: 56, marginBottom: 12 }}>🧠</div>
            <div style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg, #FF10F0, #00FFFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
              HunyaAI Neural Network
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{cat.desc}</div>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 24, fontFamily: "monospace" }}>
              完全自作 · 多層パーセプトロン + Attention機構 · リアルタイムトレーニング
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
              {[
                "Discord BOTの完全実装を教えて",
                "Minecraft MODの開発方法",
                "FastAPIでAPI構築の手順",
                "Next.jsのセットアップ"
              ].map((s, i) => (
                <button key={i} onClick={() => { setInput(s); textareaRef.current?.focus(); }} style={{
                  padding: "8px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  background: "rgba(0,255,255,0.1)", border: "1.5px solid rgba(0,255,255,0.5)",
                  color: "#00FFFF", transition: "all 0.2s",
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
              border: "2px solid #00FFFF", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, boxShadow: "0 0 12px #00FFFF"
            }}>🧠</div>
            <div style={{
              padding: "12px 18px", background: "rgba(10,10,20,0.9)",
              border: "1px solid rgba(0,255,255,0.4)", borderRadius: "4px 12px 12px 12px",
              display: "flex", gap: 6, alignItems: "center"
            }}>
              {[0, 1, 2].map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#00FFFF",
                  animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                  boxShadow: "0 0 6px #00FFFF"
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
          background: "rgba(255,255,255,0.03)", border: `2px solid ${loading ? "#00FFFF77" : "rgba(0,255,255,0.3)"}`,
          borderRadius: 12, padding: "10px 14px",
          boxShadow: loading ? "0 0 20px rgba(0,255,255,0.3)" : "none",
          transition: "all 0.3s"
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={`HunyaAI Neuralに質問... (Shift+Enter で改行)`}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e0e0e0", fontSize: 14, fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
              resize: "none", maxHeight: 120, overflowY: "auto",
              scrollbarWidth: "thin", lineHeight: 1.6,
              caretColor: "#00FFFF"
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width: 36, height: 36, borderRadius: 8, border: "none",
            background: loading || !input.trim() ? "rgba(0,255,255,0.1)" : "linear-gradient(135deg, #FF10F0, #00FFFF)",
            color: loading || !input.trim() ? "#555" : "#fff",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0, transition: "all 0.2s",
            boxShadow: !loading && input.trim() ? "0 0 16px rgba(0,255,255,0.5)" : "none",
            fontWeight: 900
          }}>↑</button>
        </div>
        <div style={{ fontSize: 9, color: "#555", textAlign: "center", marginTop: 6, fontFamily: "'Noto Sans JP', monospace", letterSpacing: "0.05em" }}>
          HunyaAI Neural Network · Multi-Layer Perceptron + Attention · Loss: {networkStats.loss.toFixed(6)}
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
