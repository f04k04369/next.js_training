import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  if (!input) {
    NextResponse.json({ error: "文字を入力してください" }, { status: 400 });
  }
  if (!sessionToken) {
    NextResponse.json(
      { error: "セッショントークンが必要です" },
      { status: 400 },
    );
  }

  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";
    const apiKey = process.env.GOOGLE_API_KEY;

    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
    };

    const requestBody = {
      input: input,
      sessionToken: sessionToken,
      includedPrimaryTypes: ["restaurant"],
      locationBias: {
        circle: {
          center: {
            latitude: 34.2895631, //香川
            longitude: 134.0473344,
          },
          radius: 10000.0,
        },
      },
      languageCode: "ja",
      includedRegionCodes: ["JP"],
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      const errorData = response.json();
      console.error(errorData);
      return { error: `NearbySearchリクエスト失敗:${response.status}` };
    }
    const data = await response.json();
    console.log("data", data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 },
    );
  }

  return NextResponse.json("success");
}
