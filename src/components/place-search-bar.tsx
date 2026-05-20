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

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const fetchSuggestions = useDebouncedCallback(async (input:string) => {
    console.log(input);
    try {
      const response = await fetch(`/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`);
    } catch (error) {
      console.error(error);
    }
  },500);
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
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
