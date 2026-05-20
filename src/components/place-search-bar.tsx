"use client";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RestaurantSuggestion } from "@/types";
import { MapPinIcon, SearchIcon } from "lucide-react";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    console.log(input);
    try {
      const response = await fetch(
        `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`,
      );
      const data: RestaurantSuggestion[] = await response.json();
      console.log("data", data);
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  }, 500);
  useEffect(() => {
    if (!inputText.trim()) {
      setOpen(false);
      return;
    }
    setOpen(true);
    fetchSuggestions(inputText);
  }, [inputText]);
  const handleBlur = () => {
    setOpen(false);
  };
  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        className=""
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
            <CommandEmpty>No results found.</CommandEmpty>
            {suggestions.map((suggestion) => {
              const label =
                suggestion.type === "placePrediction"
                  ? suggestion.placeName
                  : suggestion.query;
              const value =
                suggestion.type === "placePrediction"
                  ? suggestion.placeId
                  : suggestion.query;

              return (
                <CommandItem key={value} value={value} className="padding-5">
                  {suggestion.type === "queryPrediction" ? (
                    <SearchIcon />
                  ) : (
                    <MapPinIcon />
                  )}
                  <p>{label}</p>
                </CommandItem>
              );
            })}
          </CommandList>
        </div>
      )}
    </Command>
  );
}
