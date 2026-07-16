import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SCHEMA_PROMPT = `You are a food recognition and nutrition-estimation engine for a consumer app called Givo Food Analyzer.
Look at the photo and identify the single main food or dish shown. Then produce a realistic, professional-grade nutritional estimate as if referencing USDA FoodData Central and a registered dietitian's judgment.
Respond with ONLY raw JSON (no markdown fences, no commentary, no preamble) matching EXACTLY this shape and key names:
{
"name": string,
"category": string,
"cuisine": string,
"serving": string,
"weightGrams": number,
"confidence": {"food": number, "ingredients": number, "nutrition": number, "imageQuality": number},
"calories": number, "protein": number, "carbs": number, "netCarbs": number, "fat": number,
"fiber": number, "sugar": number, "addedSugar": number,
"satFat": number, "unsatFat": number, "transFat": number, "omega3": number, "omega6": number,
"sodium": number, "potassium": number, "calcium": number, "iron": number, "magnesium": number, "zinc": number,
"vitaminA": string, "vitaminBComplex": string, "vitaminC": string, "vitaminD": string, "vitaminE": string, "vitaminK": string, "vitaminB12": string,
"cholesterol": number, "water": number,
"healthScore": number,
"scores": {"nutrition": number, "protein": number, "heart": number, "diabetes": number, "weightLoss": number, "muscleGain": number, "gutHealth": number},
"scoreReasons": {"nutrition": string[], "protein": string[], "heart": string[], "diabetes": string[], "weightLoss": string[], "muscleGain": string[], "gutHealth": string[]},
"category_label": "Healthy" | "Moderate" | "Unhealthy",
"ingredients": [{"name": string, "quantity": number, "unit": string, "confidence": number}],
"aiExplanation": string[],
"smartRecommendations": string[],
"benefits": string[],
"risks": string[],
"betterAlternatives": string[],
"smartWarnings": string[],
"cookingSuggestions": string[],
"mealTiming": string[],
"aiCoach": string,
"dailyIntake": {"calories": number, "protein": number, "carbs": number, "fat": number},
"suitability": {"weightLoss": "Good"|"Moderate"|"Avoid", "muscleGain": "Good"|"Moderate"|"Avoid", "diabetics": "Good"|"Moderate"|"Avoid", "heart": "Good"|"Moderate"|"Avoid", "kids": "Good"|"Moderate"|"Avoid", "elderly": "Good"|"Moderate"|"Avoid"},
"allergies": string[],
"diet": {"halal": "Yes"|"No"|"Unclear", "vegetarian": boolean, "vegan": boolean}
}
Rules:
- All numeric fields are plain numbers (no units, no commas, no percent signs).
- "confidence" values and every score in "scores" are numbers from 0-100 representing a percentage (scores are on a 0-10 scale converted to percent, e.g. 7.8/10 = 78).
- "scoreReasons" arrays: exactly 2-3 short phrases (under 6 words each) explaining that score.
- "ingredients": estimate 3-6 realistic components of the dish with quantity in grams or ml and a confidence percent (0-100) for each.
- Keep every other array to at most 4 items, each item under 9 words.
- "aiCoach" is ONE short, warm, specific paragraph (2-3 sentences) coaching the user on this exact meal, like a dietitian would.
- "dailyIntake" values are percent of a 2000-kcal reference diet.
- If ingredients can't be fully seen, give your best realistic estimate.
- Be concise so the whole response fits comfortably. Output nothing but the JSON object.`;

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
        max_tokens: 2200,
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

