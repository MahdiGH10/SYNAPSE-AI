import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Do not throw at module load time — return a controlled error from the handler
// if the key is missing. This prevents the route from crashing the server
// when the environment variable is not set.

type QuestionKind = 'qcm' | 'problemes' | 'etudes_de_cas';

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

// Extract text from a PDF buffer using `pdf-parse` (Node-friendly).
// This avoids server-side DOM dependencies that pdfjs-dist may require.
async function extractPdfText(buffer: ArrayBuffer | Buffer | Uint8Array): Promise<string> {
  const pdfParseModule: any = await import('pdf-parse');
  const pdfParse = pdfParseModule.default || pdfParseModule;

  // Ensure we pass a Buffer to pdf-parse
  const buf = buffer instanceof Buffer ? buffer : Buffer.from(buffer as any);
  const data = await pdfParse(buf);
  // pdf-parse exposes extracted text in `data.text`
  return (data?.text || '').toString().trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // Ensure API key is present at request time rather than throwing at import time
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY is missing in environment. Set GEMINI_API_KEY in .env.local or your environment before calling this route.',
        },
        { status: 500 }
      );
    }
    const file = formData.get('file') as unknown as File | null;
    const type = formData.get('type') as QuestionKind | null;
    const countStr = formData.get('count') as string | null;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Fichier et type requis' },
        { status: 400 }
      );
    }

    const count =
      type === 'qcm'
        ? Math.max(
            1,
            Math.min(
              100,
              Number.isFinite(parseInt(countStr || '', 10))
                ? parseInt(countStr || '10', 10)
                : 10
            )
          )
        : 10;

    // Read file to ArrayBuffer and derive Uint8Array later
    const fileArrayBuffer = await file.arrayBuffer();
    const fileName = (file as any).name ?? 'document';
    const rawMime = file.type || '';
    const lowerName = fileName.toLowerCase();

    const inferredMime =
      rawMime ||
      (lowerName.endsWith('.pdf')
        ? 'application/pdf'
        : lowerName.endsWith('.txt')
        ? 'text/plain'
        : lowerName.endsWith('.png')
        ? 'image/png'
        : lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')
        ? 'image/jpeg'
        : '');

    const parts: GeminiPart[] = [];

    const prompt = `
Tu es un assistant pédagogique expert en français.

L'utilisateur a fourni un document et veut générer des exercices.

Type demandé : "${type}"
${type === 'qcm' ? `Nombre de questions : EXACTEMENT ${count}` : ''}

Règles strictes :
- Lis attentivement tout le document fourni.
- Génère du contenu éducatif clair, pertinent et professionnel.
- Réponds UNIQUEMENT avec du JSON valide, sans aucun texte avant ou après.

Format obligatoire selon le type :

${
  type === 'qcm'
    ? `{
  "type": "qcm",
  "title": "QCM sur [thème du cours]",
  "questionCount": ${count},
  "content": [
    {
      "question": "Question ici ?",
      "options": { "A": "Réponse 1", "B": "Réponse 2", "C": "Réponse 3", "D": "Réponse 4" },
      "answer": "A",
      "explanation": "Explication détaillée ici"
    }
  ]
}`
    : type === 'problemes'
    ? `{
  "type": "problemes",
  "title": "Problèmes corrigés - [thème]",
  "content": [
    {
      "problem": "Énoncé du problème",
      "solution": "Correction complète étape par étape"
    }
  ]
}`
    : `{
  "type": "etudes_de_cas",
  "title": "Étude de cas - [thème]",
  "content": {
    "case": "Description complète de l'étude de cas",
    "questions": [
      {
        "question": "Question liée au cas",
        "answer": "Réponse détaillée"
      }
    ]
  }
}`
}
`.trim();

    parts.push({ text: prompt });

    let addedAnyContent = false;

    if (inferredMime === 'application/pdf' || lowerName.endsWith('.pdf')) {
      // Some browsers or clients may send the full filesystem path in the
      // uploaded file name. If that happens, try to read the file from disk
      // (useful for local dev). Otherwise, fall back to the uploaded buffer.
      let pdfBuffer: Buffer;
      const looksLikePath = /\\|\//.test(fileName);
      if (looksLikePath) {
        try {
          const fs = await import('fs');
          // Try to read the path as provided. Use try/catch in case it doesn't exist.
          pdfBuffer = await fs.promises.readFile(fileName as any);
        } catch (readErr) {
          // If reading the path failed, fall back to the uploaded buffer
          pdfBuffer = fileArrayBuffer instanceof Buffer ? fileArrayBuffer : Buffer.from(fileArrayBuffer as any);
        }
      } else {
        pdfBuffer = fileArrayBuffer instanceof Buffer ? fileArrayBuffer : Buffer.from(fileArrayBuffer as any);
      }

      const pdfText = (await extractPdfText(pdfBuffer)).trim();
      if (!pdfText) {
        return NextResponse.json(
          {
            error:
              "Impossible d'extraire le texte du PDF. Le document semble ne pas contenir de texte (scan image).",
          },
          { status: 400 }
        );
      }
      const MAX_CHARS = 200_000;
      const truncated =
        pdfText.length > MAX_CHARS ? pdfText.slice(0, MAX_CHARS) : pdfText;

      parts.push({
        text: `Texte extrait du document "${fileName}":\n\n${truncated}`,
      });
      addedAnyContent = true;
    } else if (inferredMime === 'text/plain' || lowerName.endsWith('.txt')) {
      const textContent = new TextDecoder('utf-8').decode(new Uint8Array(fileArrayBuffer));
      const MAX_CHARS = 200_000;
      const truncated =
        textContent.length > MAX_CHARS
          ? textContent.slice(0, MAX_CHARS)
          : textContent;

      parts.push({
        text: `Texte fourni ("${fileName}"):\n\n${truncated}`,
      });
      addedAnyContent = true;
    } else if (inferredMime.startsWith('image/')) {
      const base64 = Buffer.from(fileArrayBuffer).toString('base64');
      parts.push({
        text: `Image fournie: "${fileName}". Analyse-la et génère les exercices au format JSON strict demandé.`,
      });
      parts.push({
        inline_data: {
          mime_type: inferredMime,
          data: base64,
        },
      });
      addedAnyContent = true;
    }

    if (!addedAnyContent) {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez PDF, TXT ou image.' },
        { status: 400 }
      );
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const details = await geminiRes.text();
      console.error('Gemini error:', details);
      return NextResponse.json(
        { error: 'Erreur Gemini', details },
        { status: geminiRes.status }
      );
    }

    const data = await geminiRes.json();
    const candidateParts: Array<{ text?: string }> =
      data?.candidates?.[0]?.content?.parts ?? [];

    let rawText = candidateParts
      .map((p) => p?.text || '')
      .join('\n')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error('JSON invalide reçu:', rawText);
      return NextResponse.json(
        { error: 'Réponse invalide de l’IA (JSON malformé)', raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (e: any) {
    console.error('Erreur serveur:', e);
    return NextResponse.json(
      { error: e?.message || 'Erreur interne' },
      { status: 500 }
    );
  }
}