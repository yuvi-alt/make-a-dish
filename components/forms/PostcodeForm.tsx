"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postcodeSchema, type PostcodePayload } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

type PostcodeFormProps = {
  registrationId: string;
  initialValues?: PostcodePayload | null;
};

type GooglePlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

type GooglePlaceDetails = {
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address: string;
  place_id: string;
};

export function PostcodeForm({
  registrationId,
  initialValues,
}: PostcodeFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [addressFieldsVisible, setAddressFieldsVisible] = useState(
    Boolean(initialValues?.addressLine1),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GooglePlacePrediction[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultValues: PostcodePayload = {
    email: initialValues?.email ?? "",
    postcode: initialValues?.postcode ?? "",
    addressLine1: initialValues?.addressLine1 ?? "",
    addressLine2: initialValues?.addressLine2 ?? "",
    city: initialValues?.city ?? "",
    county: initialValues?.county ?? "",
    country: initialValues?.country ?? "United Kingdom",
  };

  const form = useForm<PostcodePayload>({
    resolver: zodResolver(postcodeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        email: initialValues.email ?? "",
        postcode: initialValues.postcode ?? "",
        addressLine1: initialValues.addressLine1 ?? "",
        addressLine2: initialValues.addressLine2 ?? "",
        city: initialValues.city ?? "",
        county: initialValues.county ?? "",
        country: initialValues.country ?? "United Kingdom",
      });
      setAddressFieldsVisible(Boolean(initialValues.addressLine1));
      if (initialValues.addressLine1) {
        setSearchQuery(initialValues.addressLine1);
      }
    }
  }, [initialValues, form]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const errorSummary = useMemo(
    () => buildErrorSummary(form.formState.errors),
    [form.formState.errors],
  );

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setApiError(null);
      return;
    }

    setIsLoadingSuggestions(true);
    setApiError(null);
    try {
      const response = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle Google API errors
      if (data.error) {
        setApiError(data.error);
        setSuggestions([]);
        return;
      }

      if (data.status === "OK") {
        setSuggestions(data.predictions || []);
        setApiError(null);
      } else if (data.status === "ZERO_RESULTS") {
        setSuggestions([]);
        setApiError(null);
      } else if (data.status === "REQUEST_DENIED") {
        const errorMessage = data.error_message 
          ? `Google Places API error: ${data.error_message}. Please check your API key and billing settings.`
          : "Google Places API request was denied. Please check your API key and billing settings.";
        setApiError(errorMessage);
        setSuggestions([]);
      } else if (data.status === "OVER_QUERY_LIMIT") {
        setApiError("Google Places API quota exceeded. Please try again later or check your API quota.");
        setSuggestions([]);
      } else if (data.status === "INVALID_REQUEST") {
        const errorMessage = data.error_message 
          ? `Invalid request: ${data.error_message}. Please try a different search term.`
          : "Invalid request to Google Places API. Please try a different search term.";
        setApiError(errorMessage);
        setSuggestions([]);
      } else {
        const errorMessage = data.error_message 
          ? `Google Places API error: ${data.error_message}`
          : `Unable to fetch address suggestions. Status: ${data.status}`;
        setApiError(errorMessage);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      
      // Better error detection
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setApiError("Network error: Unable to reach the server. Please check your internet connection and try again.");
      } else {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setApiError(`Failed to fetch address suggestions: ${errorMsg}. Please try again or enter your address manually.`);
      }
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    // Clear API errors when user starts typing again
    if (apiError && value.trim()) {
      setApiError(null);
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const fetchPlaceDetails = async (placeId: string) => {
    setLoadingPlaceDetails(true);
    setApiError(null);
    try {
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(placeId)}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle API errors
      if (data.error) {
        setApiError(data.error);
        return null;
      }

      if (data.status === "OK" && data.result) {
        setApiError(null);
        return data.result as GooglePlaceDetails;
      } else if (data.status === "REQUEST_DENIED") {
        const errorMessage = data.error_message 
          ? `Unable to fetch address details: ${data.error_message}. Please check your API key and billing settings.`
          : "Unable to fetch address details. Please check your API key and billing settings.";
        setApiError(errorMessage);
      } else if (data.status === "NOT_FOUND") {
        setApiError("Address details not found. Please try selecting the address again.");
      } else {
        const errorMessage = data.error_message 
          ? `Failed to fetch address details: ${data.error_message}`
          : "Failed to fetch address details. Please try again.";
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Failed to fetch place details:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setApiError(`Failed to fetch address details: ${errorMsg}. Please try again or enter your address manually.`);
    } finally {
      setLoadingPlaceDetails(false);
    }
    return null;
  };

  const parseAddressComponents = (details: GooglePlaceDetails) => {
    const components = details.address_components;
    
    // Extract address components
    const streetNumber = components.find((c) =>
      c.types.includes("street_number"),
    )?.long_name || "";
    const route = components.find((c) => c.types.includes("route"))?.long_name || "";
    const subpremise = components.find((c) =>
      c.types.includes("subpremise"),
    )?.long_name || "";
    const locality = components.find((c) =>
      c.types.includes("locality"),
    )?.long_name || "";
    const administrativeAreaLevel2 = components.find((c) =>
      c.types.includes("administrative_area_level_2"),
    )?.long_name || "";
    const administrativeAreaLevel1 = components.find((c) =>
      c.types.includes("administrative_area_level_1"),
    )?.long_name || "";
    const postalCode = components.find((c) =>
      c.types.includes("postal_code"),
    )?.long_name || "";
    const country = components.find((c) =>
      c.types.includes("country"),
    )?.long_name || "";

    // Build address line 1
    const addressLine1 = [streetNumber, route].filter(Boolean).join(" ").trim();

    // Build address line 2 (optional)
    const addressLine2 = subpremise || "";

    // City
    const city = locality || "";

    // County
    const county = administrativeAreaLevel2 || administrativeAreaLevel1 || "";

    // Country
    const countryName = country || "";

    // Postcode
    const postcode = postalCode || "";

    return {
      addressLine1,
      addressLine2,
      city,
      county,
      country: countryName,
      postcode,
    };
  };

  const handleSuggestionSelect = async (prediction: GooglePlacePrediction) => {
    setSearchQuery(prediction.description);
    setShowSuggestions(false);
    setSelectedPlaceId(prediction.place_id);
    setApiError(null);

    // Fetch place details
    const details = await fetchPlaceDetails(prediction.place_id);
    if (details) {
      const parsed = parseAddressComponents(details);
      
      form.setValue("addressLine1", parsed.addressLine1, { shouldDirty: true });
      form.setValue("addressLine2", parsed.addressLine2 || "", { shouldDirty: true });
      form.setValue("city", parsed.city, { shouldDirty: true });
      form.setValue("county", parsed.county, { shouldDirty: true });
      form.setValue("country", parsed.country, { shouldDirty: true });
      form.setValue("postcode", parsed.postcode, { shouldDirty: true });

      setAddressFieldsVisible(true);
    } else {
      // If details fetch failed, show manual entry as fallback
      setAddressFieldsVisible(true);
    }
  };

  const onSubmit = async (values: PostcodePayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "postcode",
        data: values,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.message ?? "Unable to save address. Try again.");
      return;
    }

    router.push("/register/legal-entity");
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!addressFieldsVisible) {
      event.preventDefault();
      setAddressFieldsVisible(true);
      return;
    }

    return form.handleSubmit(onSubmit)(event);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" noValidate onSubmit={handleFormSubmit}>
        <ErrorSummary errors={errorSummary} />
        <FormErrorBanner message={serverError} />
        
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email address</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  {...field}
                  placeholder="your.email@example.com"
                  aria-invalid={!!fieldState.error}
                  className="max-w-md"
                />
              </FormControl>
              {fieldState.error ? (
                <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
              ) : (
                <p className="text-sm text-brand-charcoal/70">
                  We'll send a confirmation email to this address.
                </p>
              )}
            </FormItem>
          )}
        />
        
        {/* Address Search Input */}
        <div className="relative">
          <FormItem>
            <FormLabel htmlFor="address-search">
              Postcode or Address
            </FormLabel>
            <div className="relative">
              <Input
                ref={searchInputRef}
                id="address-search"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Start typing your address or postcode"
                className="max-w-md"
                aria-invalid={false}
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="address-suggestions"
              />
              {(isLoadingSuggestions || loadingPlaceDetails) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-tangerine border-t-transparent" />
                </div>
              )}
            </div>
            {apiError ? (
              <p className="text-sm text-[#C2483C]">{apiError}</p>
            ) : (
              <p className="text-sm text-brand-charcoal/70">
                Search for your business address using Google Places lookup.
              </p>
            )}
          </FormItem>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              id="address-suggestions"
              className="absolute z-50 mt-2 max-w-md rounded-2xl border border-white/60 bg-white/95 p-2 shadow-brand-soft backdrop-blur-lg"
              role="listbox"
            >
              {suggestions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  type="button"
                  role="option"
                  onClick={() => handleSuggestionSelect(prediction)}
                  className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-brand-peach/20 focus:bg-brand-peach/20 focus:outline-none"
                >
                  <div className="font-medium text-brand-charcoal">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-brand-charcoal/70">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && !isLoadingSuggestions && suggestions.length === 0 && searchQuery.trim() && !apiError && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-2 max-w-md rounded-2xl border border-white/60 bg-white/95 p-4 shadow-brand-soft backdrop-blur-lg"
            >
              <p className="text-sm text-brand-charcoal/70">
                No addresses found. Try a different search or enter manually.
              </p>
            </div>
          )}
        </div>

        {/* Manual Entry Toggle */}
        {!addressFieldsVisible && (
          <button
            type="button"
            className="text-sm font-semibold text-brand-charcoal/70 underline underline-offset-4 transition hover:text-brand-tangerine"
            onClick={() => {
              setAddressFieldsVisible(true);
              setShowSuggestions(false);
            }}
          >
            Enter address manually
          </button>
        )}

        {/* Address Fields */}
        {addressFieldsVisible ? (
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="addressLine1">Address line 1</FormLabel>
                  <FormControl>
                    <Input
                      id="addressLine1"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="addressLine2">
                    Address line 2 (optional)
                  </FormLabel>
                  <FormControl>
                    <Input id="addressLine2" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="city">City / Town</FormLabel>
                  <FormControl>
                    <Input id="city" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="county"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="county">County / Region</FormLabel>
                  <FormControl>
                    <Input id="county" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormControl>
                    <Input id="country" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="postcode">Postcode</FormLabel>
                  <FormControl>
                    <Input
                      id="postcode"
                      {...field}
                      aria-invalid={!!fieldState.error}
                      className="uppercase"
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-auto"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </form>
    </Form>
  );
}
