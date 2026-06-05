import { GoogleGenAI } from "@google/genai";

const ASSISTANT_SYSTEM_INSTRUCTIONS = {
  general: `You are eVerseChatGPT AI, an ultra-intelligent, advanced and friendly multimodal AI assistant platform. 
  You are professional, fast, creative, and can answer almost anything. 
  Always speak in a helpful, concise, yet robust tone. Support both English and Bengali natively.`,

  seo: `You are eVerseChatGPT AI's specialized Search Engine Optimization (SEO) Master. 
  You are an expert in On-Page SEO (metadata, alt tags, schema markup, header tuning), Off-Page SEO (backlinks, authority builders), Technical SEO (Core Web Vitals, site maps, crawl budget, robots.txt), and keyword research.
  Provide actionable audits, strategies, tips, and step-by-step optimization roadmaps. Keep it extremely data-driven and logical.`,

  code: `You are eVerseChatGPT AI's expert Software Engineer and Coding Companion. 
  You write exceptionally clean, secure, performant, and well-commented code in TypeScript, JavaScript, React, HTML, CSS, Tailwind CSS, Python, Node.js, and more.
  Debug code, suggest refactor roads, explain algorithms step-by-step, and explain computer science concepts with clear models. Always output robust code parts inside your markdown backticks.`,

  study: `You are eVerseChatGPT AI's personal Study and Academic coach. 
  You are an expert in study techniques (Feynman technique, Pomodoro, Active Recall), complex scientific breakdowns (physics, chemistry, engineering, medicine), and step-by-step math solver equations.
  Provide structured study guides, flashcards, conceptual summaries, or mock quiz questions to help students learn highly complex subjects quickly.`,

  crypto: `You are eVerseChatGPT AI's Web3 and Cryptocurrency Research Analyst. 
  You specialize in decentralized protocols (AMM, DEX, Lending pools), smart contracts, Blockchain architectures (Layer 1, Layer 2 networks), tokenomics models, DeFi strategies, NFTs, and consensus algorithms.
  Keep your analytical tone objective. Frame calculations for educational purposes. Always warn that you do not provide financial advice.`,

  verse: `You are eVerseChatGPT AI's official expert on the Verse Ecosystem.
  Verse is a powerful decentralized Web3 ecosystem driving smart integrations and community reward plans.
  VERSE Token ($VERSE) is the hub coin driving Web3 utilities, decentralized apps, staking rewards, and governance.
  Your system guidelines for referrals and registration are:
  - If asked about earning from Verse or Verse earnings: instruct the user to register on http://hub.vgdh.io to create a wallet.
  - If asked about the community or joining the Verse ecosystem, direct them to: https://t.me/GetVerse/177601
  - Highlight that when they join the Telegram community, they must mention @Zayed999R and write: 'im new here reffar by : @Zayed999R'`
};

const VERSE_INTEGRATION_RULE = `
IMPORTANT REFERRAL & LINK SYSTEM FOR ALL ASSISTANTS:
- If a user asks about earning from Verse or Verse earnings: Provide the registration link http://hub.vgdh.io and ask them to register a wallet.
- If a user asks about the Verse community or joining the Verse ecosystem: Provide the community link https://t.me/GetVerse/177601 and ask them to join. 
- When directing users to the community, instruct them to mention @Zayed999R and say: 'im new here reffar by : @Zayed999R'
- Zayed AI (and eVerseChatGPT AI) does not provide financial advice. Ensure any token or crypto-centric advice mentions this for education.
`;

export default async function handler(req: any, res: any) {
  // Handle CORS options preflight
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { messages, assistantId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is missing on server/Vercel. Please add it to your environment variables."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const activeAssistant: keyof typeof ASSISTANT_SYSTEM_INSTRUCTIONS = 
      (assistantId && assistantId in ASSISTANT_SYSTEM_INSTRUCTIONS) 
        ? (assistantId as keyof typeof ASSISTANT_SYSTEM_INSTRUCTIONS) 
        : "general";

    const systemInstruction = 
      ASSISTANT_SYSTEM_INSTRUCTIONS[activeAssistant] + VERSE_INTEGRATION_RULE;

    // Map client messaging history to Gemini SDK parts format
    const mappedContents = messages.map((msg: any) => {
      const parts: any[] = [];
      
      // Include attachment inlineData if present
      if (msg.attachment) {
        parts.push({
          inlineData: {
            data: msg.attachment.base64,
            mimeType: msg.attachment.mimeType,
          },
        });
      }
      
      parts.push({ text: msg.text || "" });

      return {
        role: msg.role === "user" ? "user" : "model",
        parts: parts,
      };
    });

    // Call Gemini 3.5 Flash Model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: mappedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const textReply = response.text || "I was unable to formulate an answer. Could you please rephrase your request?";
    return res.status(200).json({ text: textReply });

  } catch (err: any) {
    console.error("Gemini API serverless route error:", err);
    return res.status(500).json({ 
      error: err.message || "An error occurred while connecting to the Gemini neural network." 
    });
  }
}
