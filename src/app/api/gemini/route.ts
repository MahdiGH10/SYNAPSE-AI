import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "models/gemini-2.5-flash";

export const runtime = "nodejs";
export const maxDuration = 60;

type QuestionKind = "qcm" | "problemes" | "etudes_de_cas";

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string | null)?.toLowerCase() as
      | QuestionKind
      | undefined;
    const countRaw = formData.get("count");

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!type || !["qcm", "problemes", "etudes_de_cas"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Use 'qcm', 'problemes' or 'etudes_de_cas'." },
        { status: 400 },
      );
    }

    let count: number | undefined;
    if (type === "qcm" && countRaw) {
      count = Number(countRaw);
      if (!Number.isFinite(count) || count <= 0) {
        return NextResponse.json(
          { error: "count must be a positive number for QCM" },
          { status: 400 },
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || "uploaded.pdf";
    const mimeType = file.type || "";

    // PDF uniquement
    if (
      !fileName.toLowerCase().endsWith(".pdf") &&
      mimeType !== "application/pdf"
    ) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text || "";

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the uploaded PDF." },
        { status: 422 },
      );
    }

    const maxChars = 40_000;
    const textForModel =
      extractedText.length > maxChars
        ? extractedText.slice(0, maxChars) +
          "\n\n[Text truncated due to length.]"
        : extractedText;

    let data;
    switch (type) {
      case "qcm":
        data = await generateQCM(textForModel, count ?? 10);
        break;
      case "problemes":
        data = await generateProblems(textForModel);
        break;
      case "etudes_de_cas":
        data = await generateCaseStudy(textForModel);
        break;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/gemini:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? String(err) : undefined,
      },
      { status: 500 },
    );
  }
}

/* --------- Gemini helpers --------- */

async function callGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", res.status, text);
    throw new Error(`Gemini API error: ${res.status} - ${text}`);
  }

  const data = (await res.json()) as any;

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    data.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      .join("") ??
    "";

  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

function extractJsonFromText(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const jsonStr = text.slice(start, end + 1);
      return JSON.parse(jsonStr);
    }
    console.error("Model output not JSON:", text);
    throw new Error("Failed to parse JSON from model output");
  }
}

/* --------- Prompts par type --------- */

async function generateQCM(text: string, count: number) {
  const prompt = `
You are an expert teacher. The following text is course material:

"""${text}"""

From this text, generate exactly ${count} multiple choice questions in French.

Return ONLY JSON of the form:

{
  "type": "qcm",
  "title": "Titre du quiz",
  "questionCount": ${count},
  "content": [
    {
      "question": "Énoncé de la question",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "answer": "A",
      "explanation": "Brève explication de la bonne réponse"
    }
  ]
}
No extra text, no markdown.
`;

  const raw = await callGemini(prompt);
  return extractJsonFromText(raw);
}

async function generateProblems(text: string) {
  const prompt = `
You are a teacher. From the following material:

"""${text}"""

Generate 3 to 5 practice problems in French with detailed solutions.

Return ONLY JSON of the form:

{
  "type": "problemes",
  "title": "Titre de la série de problèmes",
  "content": [
    {
      "problem": "Énoncé du problème",
      "solution": "Solution détaillée"
    }
  ]
}
No extra text, no markdown.
`;
  const raw = await callGemini(prompt);
  return extractJsonFromText(raw);
}

async function generateCaseStudy(text: string) {
  const prompt = `
You are a pedagogy expert. From the following material:

"""${text}"""

Create one detailed case study in French with:
- a full description of the case
- 3 to 5 questions about the case
- a suggested answer for each question.

Return ONLY JSON of the form:

{
  "type": "etudes_de_cas",
  "title": "Titre de l'étude de cas",
  "content": {
    "case": "Description détaillée du cas",
    "questions": [
      {
        "question": "Question sur le cas",
        "answer": "Réponse suggérée"
      }
    ]
  }
}
No extra text, no markdown.
`;
  const raw = await callGemini(prompt);
  return extractJsonFromText(raw);
}