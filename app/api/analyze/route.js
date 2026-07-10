import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SCHEMA_PROMPT = `You are a food recognition and nutrition-estimation engine for a consumer app called Givo Food Scanner.
Look at the photo and identify the single main food or dish shown. Then produce a realistic nutritional estimate as if referencing USDA FoodData Central.
Respond with ONLY raw JSON (no markdown fences, no commentary, no preamble) matching EXACTLY this shape and key names:
{
"name": string,
"serving": string,
"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "sugar": number,
"sodium": number, "potassium": number, "calcium": number, "iron": number, "magnesium": number,
"vitaminA": string, "vitaminC": string, "vitaminD": string, "vitaminB12": string,
"cholesterol": number, "water": number,
"healthScore": number,
"category": "Healthy" | "Moderate" | "Unhealthy",
"ingredients": string[],
"benefits": string[],
"risks": string[],
"dailyIntake": {"calories": number, "protein": number, "carbs": number, "fat": number},
"suitability": {"weightLoss": "Good"|"Moderate"|"Avoid", "muscleGain": "Good"|"Moderate"|"Avoid", "diabetics": "Good"|"Moderate"|"Avoid", "heart": "Good"|"Moderate"|"Avoid", "kids": "Good"|"Moderate"|"Avoid", "elderly": "Good"|"Moderate"|"Avoid"},
"allergies": string[],
"diet": {"halal": "Yes"|"No"|"Unclear", "vegetarian": boolean, "vegan": boolean},
"suggestions": string[]
}
Rules: numbers are plain numbers (no units, no commas). Vitamin fields and "serving" are short strings. Keep every array to at most 4 items and each item under 7 words. "dailyIntake" values are percent of a 2000-kcal reference diet. If ingredients can't be fully seen, give your best realistic estimate. Be concise. Output nothing but the JSON object.`;

export async function POST(request) {
  try {
    const { image } = await request.json();
    if (!image || typeof image !== "string" || !image.startsWith("data:")) {
      return NextResponse.json({ error: "No valid image provided." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing ANTHROPIC_API_KEY. Add it in your hosting provider's environment variables." },
        { status: 500 }
      );
    }

    const mediaType = image.substring(image.indexOf(":") + 1, image.indexOf(";"));
    const base64 = image.substring(image.indexOf(",") + 1);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              { type: "text", text: SCHEMA_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return NextResponse.json(
        { error: "The nutrition engine couldn't process that photo. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = (data.content || []).map((b) => b.text || "").join("").trim();
    const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      return NextResponse.json({ error: "Couldn't read the nutrition data from that photo." }, { status: 502 });
    }

    const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json({ error: "Something went wrong analyzing that photo." }, { status: 500 });
  }
}
