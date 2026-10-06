"use client";

import { Building2, Check, Globe, Info, Loader2, Map as MapIcon, MapPin, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { AddLocationFormSchema } from "@/schema/addLocation.validator";
import useCreateLocation from "@/utils/useCreateLocation";
import useGetCity from "@/utils/useGetCity";
import useGetCountry from "@/utils/useGetCountry";
import useGetState from "@/utils/useGetState";
import LocationCombobox, { LocationMatch } from "./LocationCombobox";

type Field = "country" | "state" | "city";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { country: "", state: "", city: "" };
const FIELD_LABELS: Record<Field, string> = { country: "country", state: "state", city: "city" };

export default function AddLocationForm() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const { mutate, isPending } = useCreateLocation();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [matches, setMatches] = useState<Record<Field, LocationMatch>>({
    country: "empty",
    state: "empty",
    city: "empty",
  });
  const [savedLabel, setSavedLabel] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => dispatch(setShowAddLocationForm(false)), [dispatch]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) close();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLInputElement>("input:not([disabled])")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [close, isPending]);

  // Changing a parent clears the fields below it (a city belongs to a state, a state to a country).
  const setField = (field: Field, value: string) => {
    setSavedLabel(null);
    setErrors((e) => ({ ...e, [field]: undefined }));
    setValues((v) => {
      if (field === "country") return { country: value, state: "", city: "" };
      if (field === "state") return { ...v, state: value, city: "" };
      return { ...v, city: value };
    });
  };

  const onMatch = useCallback(
    (field: Field) => (match: LocationMatch) =>
      setMatches((m) => (m[field] === match ? m : { ...m, [field]: match })),
    [],
  );
  const onCountryMatch = useCallback((m: LocationMatch) => onMatch("country")(m), [onMatch]);
  const onStateMatch = useCallback((m: LocationMatch) => onMatch("state")(m), [onMatch]);
  const onCityMatch = useCallback((m: LocationMatch) => onMatch("city")(m), [onMatch]);

  const trimmed: Values = {
    country: values.country.trim(),
    state: values.state.trim(),
    city: values.city.trim(),
  };
  const complete = !!(trimmed.country && trimmed.state && trimmed.city);
  const preview = [trimmed.city, trimmed.state, trimmed.country].filter(Boolean).join(", ");
  const newOnes = (["country", "state", "city"] as Field[])
    .filter((f) => matches[f] === "new")
    .map((f) => FIELD_LABELS[f]);
  const footerNote = !complete
    ? "Fill all three to continue"
    : Object.values(matches).includes("checking")
      ? "Checking existing locations…"
      : newOnes.length
        ? `Creates a new ${newOnes.join(" and ")}`
        : "Everything already exists";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = AddLocationFormSchema.safeParse(trimmed);
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as Field;
        if (!next[field]) next[field] = issue.message;
      });
      setErrors(next);
      return;
    }
    mutate(
      { jwtToken, ...parsed.data },
      {
        onSuccess: () => {
          setSavedLabel(preview);
          // Keep the country so several cities can be added in a row.
          setValues((v) => ({ ...v, state: "", city: "" }));
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(15,23,42,0.48)] p-4 font-plus-jakarta"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-location-title"
        className="my-auto w-full max-w-[560px] rounded-3xl bg-white text-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-start gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF0FD] text-[#2451D6]">
            <MapPin className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="add-location-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
              Add a location
            </h2>
            <p className="mt-1 text-sm leading-normal text-[#5B6478]">
              Add a city so it can be picked when you post a job.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            disabled={isPending}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[#5B6478] hover:bg-[#F1F4F9] disabled:cursor-not-allowed"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mx-5 mb-5 flex gap-2.5 rounded-xl bg-[#F4F6FA] px-3.5 py-3 text-[13px] leading-normal text-[#475066] sm:mx-7">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2451D6]" strokeWidth={2.2} aria-hidden="true" />
          <span>Pick from the list, or type a new name. Anything that doesn’t exist yet is created for you.</span>
        </div>

        {savedLabel && (
          <div
            role="status"
            className="mx-5 mb-5 flex items-center gap-2.5 rounded-xl border border-[#BFE8D2] bg-[#E3F6EC] px-3.5 py-3 text-sm font-semibold text-[#11643C] sm:mx-7"
          >
            <Check className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} aria-hidden="true" />
            {savedLabel} added. You can add another one.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-[18px] px-5 sm:px-7">
            <LocationCombobox
              id="location-country"
              step={1}
              label="Country"
              icon={<Globe className="h-[18px] w-[18px]" aria-hidden="true" />}
              value={values.country}
              onChange={(v) => setField("country", v)}
              onMatchChange={onCountryMatch}
              useLookup={useGetCountry}
              jwtToken={jwtToken}
              error={errors.country}
            />
            <LocationCombobox
              id="location-state"
              step={2}
              label="State"
              icon={<MapIcon className="h-[18px] w-[18px]" aria-hidden="true" />}
              value={values.state}
              onChange={(v) => setField("state", v)}
              onMatchChange={onStateMatch}
              useLookup={useGetState}
              jwtToken={jwtToken}
              disabled={!trimmed.country}
              disabledPlaceholder="Choose a country first"
              error={errors.state}
            />
            <LocationCombobox
              id="location-city"
              step={3}
              label="City"
              icon={<Building2 className="h-[18px] w-[18px]" aria-hidden="true" />}
              value={values.city}
              onChange={(v) => setField("city", v)}
              onMatchChange={onCityMatch}
              useLookup={useGetCity}
              jwtToken={jwtToken}
              disabled={!trimmed.state}
              disabledPlaceholder="Choose a state first"
              error={errors.city}
            />
          </div>

          <div className="mx-5 mt-[22px] flex items-center gap-3.5 rounded-2xl border border-dashed border-[#C9D2E3] p-4 sm:mx-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#142463] text-white">
              <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#5B6478]">Shows on job posts as</div>
              <div className={complete ? "truncate text-base font-extrabold text-[#0F172A]" : "truncate text-base font-extrabold text-[#A3ACBD]"}>
                {preview || "City, State, Country"}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1F6] px-5 py-[18px] sm:px-7">
            <span className="text-[13px] text-[#5B6478]">{footerNote}</span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={close}
                disabled={isPending}
                className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!complete || isPending}
                className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isPending ? "Adding…" : "Add location"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
