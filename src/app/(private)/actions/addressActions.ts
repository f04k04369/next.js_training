"use server"
import { AddressSuggestion } from "@/types";
import { getPlaceDetails } from "@/lib/restaurants/api";

export async function selectSuggestionAction(
    suggestion: AddressSuggestion,
    sessionToken: string
) {
    console.log("selectSuggestionAction", suggestion);
    
    await getPlaceDetails(suggestion.placeId, ["location"],sessionToken);

}