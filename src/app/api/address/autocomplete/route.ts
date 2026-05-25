import {
  AddressSuggestion,
  GooglePlacesAutoCompleteApiResponse,
  RestaurantSuggestion,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  if (!input) {
    return NextResponse.json(
      { error: "文字を入力してください" },
      { status: 400 },
    );
  }
  if (!sessionToken) {
    return NextResponse.json(
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
      //   includeQueryPredictions: true,
      input: input,
      sessionToken: sessionToken,
      //   includedPrimaryTypes: ["restaurant"],
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
      //   includedRegionCodes: ["JP"],
      regionCode: "JP",
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: header,
    });

    if (!response.ok) {
      const errorData = response.json();
      console.error(errorData);
      return NextResponse.json(
        { error: `Autocompleteリクエスト失敗:${response.status}` },
        { status: 500 },
      );
    }
    const data: GooglePlacesAutoCompleteApiResponse = await response.json();
    console.log("data", JSON.stringify(data, null, 2));

    const suggestions = data.suggestions ?? [];

    const results = suggestions
      .map((suggestion) => {
        return {
          placeId: suggestion.placePrediction?.placeId,
          placeName:
            suggestion.placePrediction?.structuredFormat?.mainText?.text,
          address_text:
            suggestion.placePrediction?.structuredFormat?.secondaryText?.text,
        };
      })
      .filter(
        (suggestion): suggestion is AddressSuggestion =>
          !!suggestion.placeId &&
          !!suggestion.placeName &&
          !!suggestion.address_text,
      );

    console.log("AddressSuggestions", results);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 },
    );
  }
}
